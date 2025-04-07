import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import {
	type FeedbackUseCase,
	feedbackUseCase,
} from "src/app/dashboard/app/usecases/feedback";

/**
 * The feedback endpoint.
 */
export const feedbackEndpoint = new OpenAPIHono();

/**
 * The body schema for the feedback endpoint
 */
const feedbackBodySchema = z.object({
	timestamp: z
		.string()
		.datetime({
			message: "Invalid date format. Expected ISO 8601 format.",
		})
		.openapi({
			description:
				"The timestamp of the feedback. This should be in ISO 8601 format.",
			example: "1970-01-01T00:00:00.000Z",
		}),
	feedbackSource: z
		.enum(["email", "web", "app"], {
			message: "Invalid feedback source. Expected one of: email, web, app.",
		})
		.openapi({
			description:
				"The source of the feedback. This can be either email, web, or app.",
			example: "email",
		}),
	userIdentifier: z
		.string()
		.uuid({
			message: "Invalid UUID format.",
		})
		.openapi({
			description:
				"The identifier of the user who provided the feedback. This can be an email address, a phone number, or a unique identifier.",
			example: "123e4567-e89b-12d3-a456-426614174000",
		}),
	feedback: z
		.string({
			message: "Feedback must be between 1 and 400 characters long.",
		})
		.min(1)
		.max(400)
		.openapi({
			description: "The feedback provided by the user.",
			example: "This is a feedback.",
		}),
});

/**
 * This endpoint accepts a POST request with a JSON body.
 * The body should contain the following fields:
 *
 * The endpoint will return a 202 Accepted response if the request is valid.
 * The endpoint will return a 400 Bad Request response if the request is invalid.
 *
 * The input data will be sent to an SQS queue for processing.
 */
const route = createRoute({
	method: "post",
	path: "/",
	request: {
		body: {
			content: {
				"application/json": {
					schema: feedbackBodySchema,
				},
			},
		},
	},
	responses: {
		202: {
			description: "Accepted",
			content: {
				"application/json": {
					schema: z.object({
						message: z.string(),
					}),
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

let feedbackUseCaseInstance: FeedbackUseCase | undefined = undefined;

feedbackEndpoint.openapi(route, async (c) => {
	const body = c.req.valid("json");

	try {
		// if the feedbackUseCase is not created, create it
		if (!feedbackUseCaseInstance) {
			feedbackUseCaseInstance = feedbackUseCase();
		}

		await feedbackUseCaseInstance.execute(body);

		return c.json(
			{
				message: "Feedback received",
			},
			202,
		);
	} catch (error) {
		console.error(error);
		return c.text("Internal Server Error", 500);
	}
});
