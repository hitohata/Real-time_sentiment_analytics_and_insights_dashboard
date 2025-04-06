import OpenAI from "openai";
import { OPENAI_MODEL } from "src/shared/utils/constants";
import { OPENAI_API_KEY } from "src/shared/utils/environmentVariables";
import type {
	FeedbackSentiment,
	RowFeedback,
} from "src/shared/utils/sharedTypes";
import {
	COMMON_RESOLUTION_STRATEGIES,
	SENTIMENT_ANALYSIS_PROMPT,
	SENTIMENT_TREND_ANALYSIS_PROMPT,
} from "./aiSettings/prompts";
import {
	SENTIMENT_ANALYSIS_RESPONSE_SCHEMA,
	SUGGESTIONS_RESPONSE_SCHEMA,
	type SentimentAnalysisResponseSchema,
	type SuggestionsResponseSchema,
} from "./aiSettings/responseSchemas";

export interface IAIAnalysis {
	/**
	 * Call the AI to analyze the feedbacks and return the feedbacks with the sentiment score and label
	 * @param feedbacks
	 */
	sentimentAnalysis: (feedbacks: RowFeedback[]) => Promise<FeedbackSentiment[]>;
	/**
	 * Call the AI to analyze the trend of the feedbacks and return the three suggested actions
	 * @param feedbacks
	 */
	feedbackTrendAnalysis: (
		feedbacks: string[],
	) => Promise<SuggestionsResponseSchema>;
}

/**
 * This class is used to analyze the feedbacks
 * @implements IAIAnalysis
 */
export class AIAnalysisImplementation implements IAIAnalysis {
	private readonly client: OpenAI;

	constructor() {
		this.client = new OpenAI({
			apiKey: OPENAI_API_KEY,
		});
	}

	async sentimentAnalysis(
		feedbacks: RowFeedback[],
	): Promise<FeedbackSentiment[]> {
		// To store the feedbacks with their corresponding user IDs
		const rowFeedbackMap = new Map<string, RowFeedback>();
		const inputFeedbacks: { id: string; feedback: string }[] = [];

		// add the feedbacks to the map and the inputFeedbacks array
		for (const feedback of feedbacks) {
			rowFeedbackMap.set(feedback.userIdentifier, feedback);
			inputFeedbacks.push({
				id: feedback.userIdentifier,
				feedback: feedback.feedback,
			});
		}

		// call the AI to analyze the feedbacks
		const response = await this.client.responses.create({
			model: OPENAI_MODEL,
			input: [
				{
					role: "system",
					content: SENTIMENT_ANALYSIS_PROMPT,
				},
				{
					role: "user",
					content: JSON.stringify(inputFeedbacks),
				},
			],
			text: {
				format: SENTIMENT_ANALYSIS_RESPONSE_SCHEMA,
			},
		});

		const sentimentResult = JSON.parse(
			response.output_text,
		) as SentimentAnalysisResponseSchema; // The type is endured by the schema

		const result: FeedbackSentiment[] = [];

		// add the statement to the result
		for (const sentiment of sentimentResult.sentiments) {
			const feedback = rowFeedbackMap.get(sentiment.userId);
			if (!feedback) throw new Error("Feedback not found");
			result.push({
				...feedback,
				sentimentLabel: sentiment.label,
				sentimentScore: sentiment.score,
			});
		}

		return result;
	}

	async feedbackTrendAnalysis(
		feedbacks: string[],
	): Promise<SuggestionsResponseSchema> {
		const response = await this.client.responses.create({
			model: OPENAI_MODEL,
			input: [
				{
					role: "system",
					content: SENTIMENT_TREND_ANALYSIS_PROMPT,
				},
				{
					role: "system",
					content: COMMON_RESOLUTION_STRATEGIES,
				},
				{
					role: "user",
					content: JSON.stringify(feedbacks),
				},
			],
			text: {
				format: SUGGESTIONS_RESPONSE_SCHEMA,
			},
		});

		return JSON.parse(response.output_text) as SuggestionsResponseSchema;
	}
}

export class AIAnalysisMock implements IAIAnalysis {
	async sentimentAnalysis(
		feedbacks: RowFeedback[],
	): Promise<FeedbackSentiment[]> {
		return feedbacks.map((feedback) => ({
			...feedback,
			sentimentLabel: "positive",
			sentimentScore: 0.9,
		}));
	}

	async feedbackTrendAnalysis(
		feedbacks: string[],
	): Promise<SuggestionsResponseSchema> {
		const dummyData1: SuggestionsResponseSchema = {
			trend: "Increase in Positive Feedback",
			suggestions: [
				{
					action: "Enhance New Features",
					reason: "Continue to improve and add new features that users love.",
				},
				{
					action: "Promote Positive Reviews",
					reason: "Highlight positive feedback in marketing materials.",
				},
				{
					action: "Reward Loyal Customers",
					reason: "Implement a loyalty program to reward satisfied customers.",
				},
			],
		};

		const dummyData2: SuggestionsResponseSchema = {
			trend: "Decrease in Negative Feedback",
			suggestions: [
				{
					action: "Improve Customer Support",
					reason:
						"Enhance the customer support experience to address issues faster.",
				},
				{
					action: "Fix Reported Bugs",
					reason: "Prioritize and resolve bugs reported by users.",
				},
				{
					action: "Increase Communication",
					reason: "Keep users informed about updates and fixes.",
				},
			],
		};

		const dummyData3: SuggestionsResponseSchema = {
			trend: "Stable Neutral Feedback",
			suggestions: [
				{
					action: "Gather More Feedback",
					reason: "Encourage users to provide more detailed feedback.",
				},
				{
					action: "Analyze Neutral Comments",
					reason:
						"Investigate neutral feedback to identify areas for improvement.",
				},
				{
					action: "Engage with Users",
					reason:
						"Engage with users to understand their needs and expectations.",
				},
			],
		};

		return [dummyData1, dummyData2, dummyData3][Math.floor(Math.random() * 3)];
	}
}
