import {
	DeleteMessageCommand,
	SQSClient,
	SendMessageCommand,
} from "@aws-sdk/client-sqs";
import type { AlerterQueueType } from "src/shared/utils/sharedTypes";

export interface IAlertAnalysisQueue {
	/**
	 * put the datetime that is the starting point of time to analyze the feedbacks
	 * @param datetime
	 */
	requestAnalysis(datetime: Date): Promise<void>;

	/**
	 * remove the queue item from the queue
	 * @param receiptHandle
	 */
	deleteQueue(receiptHandle: string): Promise<void>;
}

export class AlertAnalysisQueueImplementation implements IAlertAnalysisQueue {
	private readonly sqsClient: SQSClient;
	constructor(private queueUrl: string) {
		this.sqsClient = new SQSClient({});
	}
	async requestAnalysis(datetime: Date): Promise<void> {
		const body: AlerterQueueType = {
			date: datetime.toISOString(),
		};

		const command = new SendMessageCommand({
			QueueUrl: this.queueUrl,
			MessageBody: JSON.stringify(body),
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

export class MockAlertAnalysisQueue implements IAlertAnalysisQueue {
	async requestAnalysis(datetime: Date): Promise<void> {
		return Promise.resolve();
	}

	async deleteQueue(receiptHandle: string): Promise<void> {
		return Promise.resolve();
	}
}
