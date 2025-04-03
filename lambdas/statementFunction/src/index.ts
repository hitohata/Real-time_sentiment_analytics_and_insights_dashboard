import {
	Context,
	SQSBatchItemFailure,
	SQSBatchResponse,
	SQSEvent,
	SQSHandler,
} from "aws-lambda";

export const handler = async (
	event: SQSEvent,
	context: Context,
): Promise<SQSBatchResponse> => {
	const batchItemFailures: SQSBatchItemFailure[] = [];

	// return failed queues.
	// the failed queue is added in the catch section.
	return { batchItemFailures: batchItemFailures };
};
