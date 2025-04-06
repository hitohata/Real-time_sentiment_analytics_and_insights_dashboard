import type { RowFeedback } from "src/shared/utils/sharedTypes";

export interface ISentimentQueue {
	/**
	 * Put the row feedback in the queue
	 * @param feedback
	 * @returns Promise<bool> true if the feedback was successfully added to the queue, false otherwise
	 */
	sendFeedback(feedback: RowFeedback): Promise<boolean>;

	/**
	 * remove the queue item from the queue
	 * @param id
	 */
	deleteQueue(id: string): Promise<boolean>;

	/**
	 * put the queue item back to the queue
	 * @param id
	 */
	failureQueue(id: string): Promise<boolean>;
}

export class SentimentQueueMock implements ISentimentQueue {
	constructor(private queueUrl: string) {}
	async sendFeedback(feedback: RowFeedback): Promise<boolean> {
		// TODO: Implement the logic to send the feedback to the queue
		return true;
	}

	deleteQueue(id: string): Promise<boolean> {
		return Promise.resolve(false);
	}

	failureQueue(id: string): Promise<boolean> {
		return Promise.resolve(false);
	}
}

export class MockSentimentQueue implements ISentimentQueue {
	async sendFeedback(feedback: RowFeedback): Promise<boolean> {
		return true;
	}

	deleteQueue(id: string): Promise<boolean> {
		return Promise.resolve(false);
	}

	failureQueue(id: string): Promise<boolean> {
		return Promise.resolve(false);
	}
}
