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

export interface IUseCase<I, O> {
	execute(input: I): O;
}
