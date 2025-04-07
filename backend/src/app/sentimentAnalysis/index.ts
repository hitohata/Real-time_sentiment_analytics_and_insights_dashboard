import type { SQSBatchResponse, SQSEvent } from "aws-lambda";
import { AlertAnalysisQueueImplementation } from "src/shared/queue/alertAnalysisQueue";
import { ALERT_ANALYSIS_QUEUE_URL } from "src/shared/utils/environmentVariables";
import type { RowFeedback } from "src/shared/utils/sharedTypes";
import {AIAnalysisImplementation} from "src/shared/ai/aiAnalysis";

/**
 * Alert analysis queue client
 */
const alertAnalysisQueue = new AlertAnalysisQueueImplementation(
	ALERT_ANALYSIS_QUEUE_URL,
);

/**
 * AI analysis client
 */
const aiAnalysis = new AIAnalysisImplementation();

/**
 * This function is triggered by the SQS queue.
 * This function will do the following:
 * 1. Get the message from the queue
 * 2. Send feedbacks to the AI to analyze the statement
 * 3. Save the analyzed statement to the database
 * 4. Send the latest datetime to the alert analysis queue
 * 5. Delete the message from the queue
 * @param event
 */
export const handler = async (event: SQSEvent): Promise<SQSBatchResponse> => {
	const feedbacks = event.Records.map((record) =>
		JSON.parse(record.body),
	) as RowFeedback[];
	console.log("full", feedbacks);

	try {

		const sentiments = await aiAnalysis.sentimentAnalysis(feedbacks);

		console.log(setImmediate);

		const res = await alertAnalysisQueue.requestAnalysis(new Date(Date.now()));

		console.log(res);

		return { batchItemFailures: [] };
	} catch (e) {
		console.log(e);
		const batchItemFailures = event.Records.map((record) => ({
			itemIdentifier: record.messageId,
		}));
		return { batchItemFailures: batchItemFailures };
	}
};
