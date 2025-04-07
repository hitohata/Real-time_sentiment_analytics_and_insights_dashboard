import { type Result, err, ok } from "result-ts-type";
import {
	AIAnalysisImplementation,
	AIAnalysisMock,
	type IAIAnalysis,
} from "src/shared/ai/aiAnalysis";
import type { SuggestionsResponseSchema } from "src/shared/ai/aiSettings/responseSchemas";
import {
	type ITimestreamRepository,
	MockTimestreamRepository,
	TimestreamRepositoryImpl,
} from "src/shared/repository/timestream";
import { MOCK } from "src/shared/utils/environmentVariables";
import type { IUseCase } from "src/shared/utils/sharedTypes";

interface IProps {
	rangeFrom?: Date;
	rangeTo?: Date;
}

/**
 * The suggestions use case
 * This use case extract the feedbacks from the database and call the AI to analyze the trend of the feedbacks.
 * If the input is time range.
 * It must be both or none.
 * If the time range is provided, this use case retrieves feedback from the database between the range.
 * if the time range is not provided, this use case retrieves the last 100 feedbacks from the database.
 * @param input
 * @param timestreamRepository
 * @param aiAnalysis
 */
class SuggestionsUseCase
	implements
		IUseCase<IProps, Promise<Result<SuggestionsResponseSchema, string>>>
{
	constructor(
		private readonly timestreamRepository: ITimestreamRepository,
		private readonly aiAnalysis: IAIAnalysis,
	) {}

	async execute(
		input: IProps,
	): Promise<Result<SuggestionsResponseSchema, string>> {
		const { rangeFrom, rangeTo } = input;

		if (rangeFrom && !rangeTo)
			return err("Invalid date range. The range must be both or none.");
		if (!rangeFrom && rangeTo)
			return err("Invalid date range. The range must be both or none.");

		if (rangeFrom && rangeTo && rangeTo > rangeFrom)
			err("Invalid date range. The range `from` must be greater than `to`.");

		const feedbacks: string[] = [];

		// retrieve feedbacks from the database
		if (rangeFrom && rangeTo) {
			const storedFeedback = await this.timestreamRepository.readTimeRange(
				rangeFrom,
				rangeTo,
			);
			for (const feedback of storedFeedback) {
				feedbacks.push(feedback.feedback);
			}
		} else {
			const storedFeedback = await this.timestreamRepository.readRecords(100);
			for (const feedback of storedFeedback) {
				feedbacks.push(feedback.feedback);
			}
		}

		return ok(await this.aiAnalysis.feedbackTrendAnalysis(feedbacks));
	}
}

const generateSuggestionsUseCase = async () => {
	if (MOCK) {
		return new SuggestionsUseCase(
			new MockTimestreamRepository(),
			new AIAnalysisMock(),
		);
	}
	return new SuggestionsUseCase(
		new TimestreamRepositoryImpl(),
		await AIAnalysisImplementation.create(),
	);
};

export const suggestionsUseCase = generateSuggestionsUseCase();
