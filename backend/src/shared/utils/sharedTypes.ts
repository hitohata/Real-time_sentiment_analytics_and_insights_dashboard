/**
 * The input from the feedback endpoint
 */
export type RowFeedback = {
	/**
	 * The feedback timestamp
	 */
	timestamp: string;
	/**
	 * The feedback source
	 */
	feedbackSource: "web" | "email" | "app";
	/**
	 * The user ID. This is UUID.
	 */
	userIdentifier: string;
	/**
	 * The feedback text from a user
	 */
	feedback: string;
};

/**
 * The feedback with sentiment
 */
export type FeedbackSentiment = {
	/**
	 * Sentiment label
	 * This is a string that can be either "positive", "negative", or "neutral".
	 */
	sentimentLabel: string;
	/**
	 * Sentiment score
	 * This is a number between -1 and 1.
	 * -1 is very negative
	 * 0 is neutral
	 * 1 is very positive
	 */
	sentimentScore: number;
} & RowFeedback;

/**
 * This type if for the feedback summary
 * This data is delivered to clients, the `userIdentifier` is not included
 */
export type FeedbackSummary = Omit<FeedbackSentiment, "userIdentifier">;

/**
 * The use case interface
 * The generic types are:
 * - I: The input type
 * - O: The output type
 */
export interface IUseCase<I, O> {
	execute(input: I): O;
}

/**
 * The queue type for the alerting service
 */
export type AlerterQueueType = {
	/**
	 * The latest feedback datetime
	 * This is a string in ISO 8601 format
	 */
	date: string;
};
