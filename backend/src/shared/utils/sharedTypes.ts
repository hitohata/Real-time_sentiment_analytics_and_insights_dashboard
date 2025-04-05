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
 * The feedback with statement
 */
export type FeedbackStatement = {
	/**
	 * Statement label
	 * This is a string that can be either "positive", "negative", or "neutral".
	 */
	statementLabel: string;
	/**
	 * Statement score
	 * This is a number between -1 and 1.
	 * -1 is very negative
	 * 0 is neutral
	 * 1 is very positive
	 */
	statement: number;
} & RowFeedback;
