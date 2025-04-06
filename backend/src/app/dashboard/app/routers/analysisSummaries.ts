import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { analysisSummaryUseCase } from "src/app/dashboard/app/usecases/analysisSummaryUseCase";

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
				sentimentLabel: z.enum(["positive", "negative", "neutral"]),
				sentimentScore: z.number().min(-1).max(1).openapi({
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
					sentimentLabel: "positive",
					sentimentScore: 0.5,
				},
				{
					timestamp: "1970-01-01T00:00:01.000Z",
					feedbackSource: "web",
					feedback: "This is a feedback.",
					sentimentLabel: "neutral",
					sentimentScore: 0.0,
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
				"text/plain": {
					schema: z.string(),
				},
			},
		},
	},
});

analyticsSummariesEndpoint.openapi(route, async (c) => {
	const { from, to } = c.req.valid("query");

	try {
		const result = await analysisSummaryUseCase.execute({
			rangeFrom: from ? new Date(from) : undefined,
			rangeTo: to ? new Date(to) : undefined,
		});

		if (result.err) {
			return c.json(
				{
					message: result.error,
				},
				400,
			);
		}

		return c.json(
			{
				summaries: result.value.map((summary) => ({
					timestamp: summary.timestamp,
					feedbackSource: summary.feedbackSource as "email" | "web" | "app",
					feedback: summary.feedback,
					sentimentLabel: summary.sentimentLabel as
						| "positive"
						| "negative"
						| "neutral",
					sentimentScore: summary.sentimentScore,
				})),
			},
			200,
		);
	} catch (error) {
		console.error(error);
		return c.text("Internal Server Error", 500);
	}
});
