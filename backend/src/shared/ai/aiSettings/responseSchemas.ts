import type { ResponseFormatTextConfig } from "openai/resources/responses/responses";

/**
 * The response format for the sentiment analysis.
 * The response format is a JSON schema that defines the structure of the response.
 *
 * @Example
 * ```json
 * {
 *  "sentiments": [
 *    {
 *      "userId": "string",
 *      "label": "string",
 *      "score": 0
 *    }
 *  ]
 * }
 * ```
 */
export const SENTIMENT_ANALYSIS_RESPONSE_SCHEMA: ResponseFormatTextConfig = {
	type: "json_schema",
	name: "sentiment",
	schema: {
		type: "object",
		properties: {
			sentiments: {
				type: "array",
				items: {
					type: "object",
					properties: {
						userId: {
							type: "string",
							description: "The User ID",
						},
						label: {
							type: "string",
							description: "The sentiment label",
							enum: ["positive", "negative", "neutral"],
						},
						score: {
							type: "number",
							description: "The sentiment score",
						},
					},
					additionalProperties: false,
					required: ["userId", "label", "score"],
				},
			},
		},
		additionalProperties: false,
		required: ["sentiments"],
	},
};

/**
 * The response schema for the sentiment analysis.
 * This is the type of the response that is returned by the AI.
 */
export type SentimentAnalysisResponseSchema = {
	sentiments: {
		userId: string;
		label: string;
		score: number;
	}[];
};

/**
 * The response format is a JSON schema that defines the structure of the response.
 *
 * @Example
 * ```json
 * {
 * 	"title": "string",
 * 	"actions" [
 * 	  	{
 * 			"action": "string",
 * 			"reason": "string"
 * 	    }
 * 	 ],
 * }
 * ```
 */
export const SUGGESTIONS_RESPONSE_SCHEMA: ResponseFormatTextConfig = {
	type: "json_schema",
	name: "suggestions",
	schema: {
		type: "object",
		properties: {
			trend: {
				type: "string",
				description: "current trend of the feedback",
			},
			actions: {
				type: "array",
				items: {
					type: "object",
					properties: {
						action: {
							type: "string",
							description: "the action to be taken",
						},
						reason: {
							type: "string",
							description: "the reason why this suggestion is made",
						},
					},
					additionalProperties: false,
					required: ["title", "description"],
				},
			},
		},
		additionalProperties: false,
		required: ["trend", "actions"],
	},
};

/**
 * The response schema for the suggestions.
 */
export type SuggestionsResponseSchema = {
	trend: string;
	actions: {
		title: string;
		description: string;
	}[];
};
