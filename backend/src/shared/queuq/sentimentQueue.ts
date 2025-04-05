import type { RowFeedback } from "src/shared/utils/sharedTypes";

export interface ISentimentQueue {
	/**
	 * Put the row feedback in the queue
	 * @param feedback
	 * @returns Promise<bool> true if the feedback was successfully added to the queue, false otherwise
	 */
	sendFeedback(feedback: RowFeedback): Promise<boolean>;
}

export class SentimentQueueMock implements ISentimentQueue {
	async sendFeedback(feedback: RowFeedback): Promise<boolean> {
		// TODO: Implement the logic to send the feedback to the queue
		return true;
	}
}

export class MockSentimentQueue implements ISentimentQueue {
	async sendFeedback(feedback: RowFeedback): Promise<boolean> {
		return true;
	}
}
