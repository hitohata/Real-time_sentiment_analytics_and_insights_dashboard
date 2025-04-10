import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import {
	type SuggestionsUseCase,
	suggestionsUseCase,
} from "src/app/dashboard/app/usecases/suggestionsUseCase";
import { SuggestionsResponseSchema } from "src/shared/ai/aiSettings/responseSchemas";

export const suggestionEndpoint = new OpenAPIHono();

/**
 * The suggestions schema for the dashboard users.
 */
const suggestionsSchema = z.object({
	trend: z.string().openapi({
		description: "The current trend of the feedback.",
		example: "positive feedback is increasing.",
	}),
	suggestions: z
		.array(
			z.object({
				action: z.string().openapi({
					description: "The actions that we should take.",
					example: "This is a suggestion.",
				}),
				reason: z.string().openapi({
					description: "The impact of the suggestion.",
					example: "the dashboard is very useful.",
				}),
			}),
		)
		.max(3)
		.openapi({
			description: "The suggestions for the dashboard users.",
			example: [
				{
					action: "This is a suggestion.",
					reason: "This is a reason.",
				},
				{
					action: "This is another suggestion.",
					reason: "This is another reason.",
				},
				{
					action: "This is a third suggestion.",
					reason: "This is a third reason.",
				},
			],
		}),
});

/**
 * The query parameters for the suggestions.
 */
const suggestionsParameters = z.object({
	from: z
		.string()
		.datetime({
			message: "Invalid date format. Expected ISO 8601 format.",
		})
		.optional()
		.openapi({
			description:
				"The start date for the suggestions data. This should be in ISO 8601 format.",
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
				"The end date for the suggestions data. This should be in ISO 8601 format.",
			example: "1970-01-01T00:00:00.000Z",
		}),
});

const route = createRoute({
	method: "get",
	path: "/",
	request: {
		query: suggestionsParameters,
	},
	responses: {
		200: {
			description:
				"The suggestions for the dashboard users. These suggestions are generated by the AI model. So, it can be long time to get the suggestions.",
			content: {
				"application/json": {
					schema: suggestionsSchema,
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

let suggestionUseCaseInstance: SuggestionsUseCase | undefined = undefined;

suggestionEndpoint.openapi(route, async (c) => {
	const { from, to } = c.req.valid("query");

	try {
		// Initialize the use case if it is not already initialized
		if (!suggestionUseCaseInstance) {
			suggestionUseCaseInstance = await suggestionsUseCase();
		}

		const result = await suggestionUseCaseInstance.execute({
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

		return c.json(result.value, 200);
	} catch (error) {
		console.error(error);
		return c.text("Internal Server Error", 500);
	}
});
