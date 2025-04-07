import { v7 } from "uuid";
import { FEEDBACK_API_URL } from "./environmentVariables";
import {
	negativeFeedbacks,
	neutralFeedbacks,
	positiveFeedbacks,
} from "./feedbacks";

/**
 * this is the mode of feedback comment
 * positive - positive feedback
 * neutral - neutral feedback
 * negative - negative feedback
 * mock - random feedback
 */
type ModeType = "positive" | "negative" | "neutral" | "mock";

/**
 * This function call the feedback endpoint with the feedback data.
 * The feedback data is generated randomly from the feedbacks.ts file.
 * The generated feedback data is sent to the feedback endpoint as a POST request.
 * The data is generated randomly based on the argument.
 * If  the argument is "positive", the feedback is positive.
 * If the argument is "neutral", the feedback is neutral.
 * If the argument is "mock", the feedback is random.
 * If the argument is "negative", the feedback is negative.
 * @param mode - The mode of the feedback. It can be "positive", "negative", or "mock".
 */
function callFeedbackEndpoint(mode: ModeType) {
	// positive feedback
	if (mode === "positive") {
		postFeedbackData(
			positiveFeedbacks[
				Math.floor(Math.random() * positiveFeedbacks.length)
			],
		);
		return
	}

	// neutral feedback
	if (mode === "neutral") {
		postFeedbackData(
			neutralFeedbacks[Math.floor(Math.random() * neutralFeedbacks.length)],
		);
		return
	}

	// negative feedback
	if (mode === "negative") {
		postFeedbackData(
			negativeFeedbacks[
				Math.floor(Math.random() * negativeFeedbacks.length)
			],
		);
		return
	}

	// random feedback "mock"
	const feedbacks = [
		...positiveFeedbacks,
		...negativeFeedbacks,
		...neutralFeedbacks,
	];
	postFeedbackData(feedbacks[Math.floor(Math.random() * feedbacks.length)]);
}

/**
 * The feedback data is generated randomly from the feedbacks.ts file.
 * The generated feedback data is sent to the feedback endpoint as a POST request.
 * @param feedback - The feedback string to be sent to the feedback endpoint.
 */
const postFeedbackData = (feedback: string) => {
	const feedbackSource = (): "web" | "email" | "app" => {
		const randomFeedback = Math.floor(Math.random() * 3);
		if (randomFeedback === 0) return "web";
		if (randomFeedback === 1) return "email";
		return "app";
	};

	const feedbackData = {
		userIdentifier: v7(),
		feedback: feedback,
		feedbackSource: feedbackSource(),
		timestamp: new Date().toISOString(),
	};

	fetch(FEEDBACK_API_URL, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(feedbackData),
	})
		.then((_) => {
			console.log("Feedback sent successfully:");
			console.log(feedbackData);
		})
		.catch((error) => {
			console.error("Error sending feedback:", error);
		});
};

function isModeType(mode: string): mode is ModeType {
	return ["positive", "negative", "neutral", "mock"].includes(mode);
}

/**
 * call the feedback endpoint every 2 seconds
 */
const main = () => {
	console.log("Feedback Ingestion Simulator");
	const mode = process.argv[2];
	if (!isModeType(mode)) throw new Error("Invalid mode");
	console.log("mode", mode);

	// call the feedback endpoint every 2 seconds
	setInterval(() => callFeedbackEndpoint(mode), 2000);
};

main();
