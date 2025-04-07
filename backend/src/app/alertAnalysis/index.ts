import type {SQSBatchResponse, SQSEvent} from "aws-lambda";
import type {AlerterQueueType} from "src/shared/utils/sharedTypes";

/**
 * This function is the handler for the Lambda function.
 * It will be invoked when the Lambda function is triggered.
 * @param event
 */
export const handler = async (event: SQSEvent): Promise<SQSBatchResponse> => {

	const batchItemFailures = [];

	// This queue get only one message at a time.
	const record = event.Records[0] as unknown as AlerterQueueType;

	try {

		console.log("event", record);

		return { batchItemFailures: [] };

	} catch (error) {
		console.error(error);
		batchItemFailures.push({
			itemIdentifier: event.Records[0].messageId
		});
		return {
			batchItemFailures
		};
	}
};
