import type { SQSBatchResponse, SQSEvent } from "aws-lambda";
import { AlertAnalysisQueueImplementation } from "src/shared/queue/alertAnalysisQueue";
import { ALERT_ANALYSIS_QUEUE_URL } from "src/shared/utils/environmentVariables";
import type { RowFeedback } from "src/shared/utils/sharedTypes";

/**
 * Alert analysis queue client
 */
const alertAnalysisQueue = new AlertAnalysisQueueImplementation(
	ALERT_ANALYSIS_QUEUE_URL,
);

/**
 * Thi function is triggered by the SQS queue.
 * This function will do the following:
 * 1. Get the message from the queue
 * 2. Send feedbacks to the AI to analyze the statement
 * 3. Save the analyzed statement to the database
 * 4. Send the latest datetime to the alert analysis queue
 * 5. Delete the message from the queue
 * @param event
 */
export const handler = async (event: SQSEvent): Promise<SQSBatchResponse> => {
	const batchItemFailures = [];

	const feedbacks = event.Records.map((record) =>
		JSON.parse(record.body),
	) as RowFeedback[];
	console.log("full", feedbacks);

	try {
		for (const record of event.Records) {
			const body = JSON.parse(record.body);
			console.log(body);
		}

		const res = await alertAnalysisQueue.requestAnalysis(new Date(Date.now()));

		console.log(res);

		return { batchItemFailures: [] };
	} catch (e) {
		console.log(e);
		for (const record of event.Records) {
			batchItemFailures.push({
				itemIdentifier: record.messageId,
			});
		}
		return { batchItemFailures: batchItemFailures };
	}
};
