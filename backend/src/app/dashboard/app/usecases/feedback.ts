import {
	type ISentimentQueue,
	MockSentimentQueue,
	SentimentQueueImpl,
} from "src/shared/queuq/sentimentQueue";
import {
	MOCK,
	SENTIMENT_QUEUE_URL,
} from "src/shared/utils/environmentVariables";
import type { IUseCase, RowFeedback } from "src/shared/utils/sharedTypes";

class FeedbackUseCase implements IUseCase<RowFeedback, void> {
	constructor(private readonly sentimentQueue: ISentimentQueue) {}

	async execute(input: RowFeedback): Promise<void> {
		await this.sentimentQueue.sendFeedback(input);
	}
}

const generateFeedbackUseCase = () => {
	if (MOCK) {
		return new FeedbackUseCase(new MockSentimentQueue());
	}
	return new FeedbackUseCase(new SentimentQueueImpl(SENTIMENT_QUEUE_URL));
};

export const feedbackUseCase = generateFeedbackUseCase();
