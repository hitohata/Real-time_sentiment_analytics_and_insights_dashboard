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
 * The response format for the sentiment trend analysis.
 * The response format is a JSON schema that defines the structure of the response.
 *
 * @Example
 * ```json
 * {
 *  "trend": [
 *    {
 *      "title": "string",
 *      "description": "string"
 *    }
 *  ]
 * }
 * ```
 */
export const SENTIMENT_TREND_RESPONSE_SCHEMA: ResponseFormatTextConfig = {
	type: "json_schema",
	name: "trend",
	schema: {
		type: "object",
		properties: {
			trend: {
				type: "array",
				items: {
					type: "object",
					properties: {
						title: {
							type: "string",
							description: "title of suggestions",
						},
						description: {
							type: "string",
							description: "detail of suggestions",
						},
					},
					additionalProperties: false,
					required: ["title", "description"],
				},
			},
		},
		additionalProperties: false,
		required: ["trend"],
	},
};

/**
 * The response schema for the sentiment trend.
 */
export type SentimentTrendResponseSchema = {
	sentiments: {
		title: string;
		description: string;
	}[];
};
