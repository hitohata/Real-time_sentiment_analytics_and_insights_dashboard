import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";

export const analyticsSummariesEndpoint = new OpenAPIHono();

/**
 * The summaries of the feedbacks.
 */
const analyticsSummariesSchema = z.object({
	summaries: z
		.array(
			z.object({
				timestamp: z.string().datetime(),
				feedbackSource: z.enum(["email", "web", "app"]),
				feedback: z.string().openapi({
					description: "The feedback from the user.",
					example: "This is a feedback.",
				}),
				statementLabel: z.enum(["positive", "negative", "neutral"]),
				statementScore: z.number().min(-1).max(1).openapi({
					description:
						"The score of the statement. This should be between -1 and 1. The -1 means negative and 1 means positive.",
					example: 0.5,
				}),
			}),
		)
		.openapi({
			example: [
				{
					timestamp: "1970-01-01T00:00:00.000Z",
					feedbackSource: "email",
					feedback: "This is a feedback.",
					statementLabel: "positive",
					statementScore: 0.5,
				},
				{
					timestamp: "1970-01-01T00:00:01.000Z",
					feedbackSource: "web",
					feedback: "This is a feedback.",
					statementLabel: "neutral",
					statementScore: 0.0,
				},
			],
		}),
});

/**
 * The query parameters for the summaries.
 */
const analyticsSummariesParameters = z.object({
	from: z
		.string()
		.datetime({
			message: "Invalid date format. Expected ISO 8601 format.",
		})
		.optional()
		.openapi({
			description:
				"The start date for the summaries data. This should be in ISO 8601 format.",
			example: "1970-01-01T00:00:00.000Z",
		}),
	to: z
		.string()
		.datetime({
			message: "Invalid date format. Expected ISO 8601 format.",
		})
		.optional()
		.openapi({
			description:
				"The end date for the summaries data. This should be in ISO 8601 format.",
			example: "1970-01-01T00:00:00.000Z",
		}),
});

const route = createRoute({
	method: "get",
	path: "/",
	request: {
		query: analyticsSummariesParameters,
	},
	responses: {
		200: {
			description: "OK",
			content: {
				"application/json": {
					schema: analyticsSummariesSchema,
				},
			},
		},
		400: {
			description: "Bad Request",
			content: {
				"application/json": {
					schema: z.object({
						message: z.string(),
					}),
				},
			},
		},
		500: {
			description: "Internal Server Error",
			content: {
				"application/json": {
					schema: z.object({
						message: z.string(),
					}),
				},
			},
		},
	},
});

analyticsSummariesEndpoint.openapi(route, (c) => {
	const { from, to } = c.req.valid("query");

	return c.json({ summaries: [] }, 200);
});
