import {
	DeleteMessageCommand,
	SQSClient,
	SendMessageCommand,
} from "@aws-sdk/client-sqs";
import type { RowFeedback } from "src/shared/utils/sharedTypes";
import { v7 } from "uuid";

export interface ISentimentQueue {
	/**
	 * Put the row feedback in the queue
	 * @param feedback
	 * @returns Promise<bool> true if the feedback was successfully added to the queue, false otherwise
	 */
	sendFeedback(feedback: RowFeedback): Promise<void>;

	/**
	 * remove the queue item from the queue
	 * This is takes a receipt handle
	 * @param receiptHandle
	 */
	deleteQueue(receiptHandle: string): Promise<void>;
}

export class SentimentQueueImpl implements ISentimentQueue {
	private readonly sqsClient: SQSClient;
	constructor(private queueUrl: string) {
		this.sqsClient = new SQSClient({});
	}
	async sendFeedback(feedback: RowFeedback): Promise<void> {
		const command = new SendMessageCommand({
			MessageGroupId: v7(),
			QueueUrl: this.queueUrl,
			MessageBody: JSON.stringify(feedback),
		});

		await this.sqsClient.send(command);
	}

	async deleteQueue(receiptHandle: string): Promise<void> {
		const command = new DeleteMessageCommand({
			QueueUrl: this.queueUrl,
			ReceiptHandle: receiptHandle,
		});
		await this.sqsClient.send(command);
	}
}

export class MockSentimentQueue implements ISentimentQueue {
	async sendFeedback(feedback: RowFeedback): Promise<void> {
		console.log("received feedback", feedback);
		return Promise.resolve(undefined);
	}

	deleteQueue(receiptHandle: string): Promise<void> {
		return Promise.resolve(undefined);
	}
}
