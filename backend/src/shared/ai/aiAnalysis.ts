import OpenAI from "openai";
import { OPENAI_MODEL } from "src/shared/utils/constants";
import { OPENAI_API_KEY } from "src/shared/utils/environmentVariables";
import type {
	FeedbackSentiment,
	RowFeedback,
} from "src/shared/utils/sharedTypes";
import {
	SENTIMENT_ANALYSIS_PROMPT,
	SENTIMENT_TREND_ANALYSIS_PROMPT,
} from "./aiSettings/prompts";
import {
	SENTIMENT_ANALYSIS_RESPONSE_SCHEMA,
	SENTIMENT_TREND_RESPONSE_SCHEMA,
	type SentimentAnalysisResponseSchema,
	type SentimentTrendResponseSchema,
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
	) => Promise<SentimentTrendResponseSchema>;
}

const client = new OpenAI({
	apiKey: OPENAI_API_KEY,
});

/**
 * This class is used to analyze the feedbacks
 * @implements IAIAnalysis
 */
export class AIAnalysisImplementation implements IAIAnalysis {
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
		const response = await client.responses.create({
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
	): Promise<SentimentTrendResponseSchema> {
		const response = await client.responses.create({
			model: OPENAI_MODEL,
			input: [
				{
					role: "system",
					content: SENTIMENT_TREND_ANALYSIS_PROMPT,
				},
				{
					role: "user",
					content: JSON.stringify(feedbacks),
				},
			],
			text: {
				format: SENTIMENT_TREND_RESPONSE_SCHEMA,
			},
		});

		return JSON.parse(response.output_text) as SentimentTrendResponseSchema;
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
	): Promise<SentimentTrendResponseSchema> {
		const dummyData1: SentimentTrendResponseSchema = {
			trend: [
				{
					title: "Increase in Positive Feedback",
					description:
						"Users are increasingly satisfied with the new features.",
				},
				{
					title: "Decrease in Negative Feedback",
					description: "Fewer complaints about the app's performance.",
				},
				{
					title: "Stable Neutral Feedback",
					description: "Neutral feedback remains consistent over time.",
				},
			],
		};

		const dummyData2: SentimentTrendResponseSchema = {
			trend: [
				{
					title: "Positive Sentiment Growth",
					description: "Positive sentiment has grown by 20% this quarter.",
				},
				{
					title: "Negative Sentiment Decline",
					description: "Negative sentiment has decreased by 15%.",
				},
				{
					title: "Neutral Sentiment Stability",
					description: "Neutral sentiment has remained stable.",
				},
			],
		};

		const dummyData3: SentimentTrendResponseSchema = {
			trend: [
				{
					title: "High Satisfaction with Support",
					description: "Users are very satisfied with customer support.",
				},
				{
					title: "Improved User Experience",
					description: "Feedback indicates a better user experience.",
				},
				{
					title: "Consistent Feedback on Features",
					description: "Feedback on features has been consistent.",
				},
			],
		};

		return [dummyData1, dummyData2, dummyData3][Math.floor(Math.random() * 3)];
	}
}
