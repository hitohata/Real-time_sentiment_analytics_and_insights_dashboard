import OpenAI from "openai/index";
import { OPENAI_MODEL } from "src/shared/utils/constants";
import { OPENAI_API_KEY } from "src/shared/utils/environmentVariables";
import type {
	FeedbackStatement,
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

const client = new OpenAI({
	apiKey: OPENAI_API_KEY,
});

/**
 * This function analyzes user feedback and returns the sentiment analysis.
 * @param feedbacks  The feedback to analyze
 * @returns The sentiment analysis of the feedback
 */
export const aiAnalysis = async (
	feedbacks: RowFeedback[],
): Promise<FeedbackStatement[]> => {
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

	const statementsResult = JSON.parse(
		response.output_text,
	) as SentimentAnalysisResponseSchema; // The type is endured by the schema

	const result: FeedbackStatement[] = [];

	// add the statement to the result
	for (const statement of statementsResult.sentiments) {
		const feedback = rowFeedbackMap.get(statement.userId);
		if (!feedback) throw new Error("Feedback not found");
		result.push({
			...feedback,
			statementLabel: statement.label,
			statement: statement.score,
		});
	}

	return result;
};

/**
 * This function analyzes user feedback and returns the sentiment analysis.
 * @param feedbacks  The feedbacks to analyze
 * @returns The sentiment analysis of the feedback
 */
export const feedbackTrendAnalysis = async (
	feedbacks: string[],
): Promise<SentimentTrendResponseSchema> => {
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
};
