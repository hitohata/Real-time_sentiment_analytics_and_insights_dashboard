import type { SQSBatchResponse, SQSEvent } from "aws-lambda";
import { TimestreamRepositoryImpl } from "src/shared/repository/timestream";
import type {
	AlerterQueueType,
	FeedbackSummary,
} from "src/shared/utils/sharedTypes";

/**
 * Timestream client
 */
const timestreamRepository = new TimestreamRepositoryImpl();

/**
 * This function is the handler for the Lambda function.
 * It will be invoked when the Lambda function is triggered.
 * @param event
 */
export const handler = async (event: SQSEvent): Promise<SQSBatchResponse> => {
	// This queue get only one message at a time.
	const record = JSON.parse(
		event.Records[0].body,
	) as unknown as AlerterQueueType;

	try {
		// The start point of alert analysis
		const latestDatetime = new Date(record.date);
		const fiveMinAgo = new Date(latestDatetime.getTime() - 5 * 60 * 1000);

		const feedbacks = await timestreamRepository.readTimeRange(
			fiveMinAgo,
			latestDatetime,
		);

		const negativeFeedbacks = feedbacks.filter(
			(feedback) => feedback.sentimentLabel === "negative",
		);

		// no problem if there are less than 6 negative feedbacks
		if (negativeFeedbacks.length < 6) {
			return { batchItemFailures: [] };
		}

		console.log("negativeFeedbacks", negativeFeedbacks);

		return { batchItemFailures: [] };
	} catch (error) {
		console.error(error);
		const batchItemFailures = [
			{
				itemIdentifier: event.Records[0].messageId,
			},
		];
		return {
			batchItemFailures,
		};
	}
};
