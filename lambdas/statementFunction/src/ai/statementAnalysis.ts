import OpenAI from "openai/index";
import { STATEMENT_PROMPT } from "./aiSettings/prompts";
import {
	STATEMENT_RESPONSE_SCHEMA,
	type StatementAnalysisResponseSchema,
} from "./aiSettings/responseSchemas";
import type { FeedbackStatement, RowFeedback } from "../urils/sharedTypes";

const client = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

/**
 * This function analyzes user feedback and returns the sentiment analysis.
 * @param feedbacks  The feedback to analyze
 * @returns The sentiment analysis of the feedback
 */
const analyzeUserFeedback = async (
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
		model: "gpt-4o-mini-2024-07-18",
		input: [
			{
				role: "system",
				content: STATEMENT_PROMPT,
			},
			{
				role: "user",
				content: JSON.stringify(inputFeedbacks),
			},
		],
		text: {
			format: STATEMENT_RESPONSE_SCHEMA,
		},
	});

	const statementsResult = JSON.parse(
		response.output_text,
	) as StatementAnalysisResponseSchema; // The type is endured by the schema

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
