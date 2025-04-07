import type { SQSBatchResponse, SQSEvent } from "aws-lambda";
import { AlertAnalysisQueueImplementation } from "src/shared/queue/alertAnalysisQueue";
import { ALERT_ANALYSIS_QUEUE_URL } from "src/shared/utils/environmentVariables";
import type {FeedbackSentiment, RowFeedback} from "src/shared/utils/sharedTypes";
import {AIAnalysisImplementation} from "src/shared/ai/aiAnalysis";
import {late} from "zod";

/**
 * Alert analysis queue client
 */
const alertAnalysisQueue = new AlertAnalysisQueueImplementation(
	ALERT_ANALYSIS_QUEUE_URL,
);

/**
 * AI analysis client
 */
let aiAnalysis: AIAnalysisImplementation | null = null;

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

	try {
		// if there aiAnalysis is not created, create it
		if (!aiAnalysis) {
			aiAnalysis = await AIAnalysisImplementation.create();
		}

		const sentiments = await aiAnalysis.sentimentAnalysis(feedbacks);

		const latestTimeStamp = getLatestTimestamp(sentiments);

		if (!latestTimeStamp) {
			throw new Error("No latest timestamp found. The AI generation might failed.");
		}

		const res = await alertAnalysisQueue.requestAnalysis(new Date(latestTimeStamp));

		return { batchItemFailures: [] };
	} catch (e) {
		console.error(e);
		const batchItemFailures = event.Records.map((record) => ({
			itemIdentifier: record.messageId,
		}));
		return { batchItemFailures: batchItemFailures };
	}
};

/**
 * Get a latest timestamp from the data
 * @param data
 */
function getLatestTimestamp(data: FeedbackSentiment[]): string | undefined {
	if (data.length === 0) {
		return undefined;
	}

	let latestTimestamp = data[0].timestamp;

	for (let i = 1; i < data.length; i++) {
		if (data[i].timestamp > latestTimestamp) {
			latestTimestamp = data[i].timestamp;
		}
	}

	return latestTimestamp;
}
