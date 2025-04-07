import { type Result, err, ok } from "result-ts-type";
import {
	type ITimestreamRepository,
	MockTimestreamRepository,
	TimestreamRepositoryImpl,
} from "src/shared/repository/timestream";
import { MOCK } from "src/shared/utils/environmentVariables";
import type { FeedbackSummary, IUseCase } from "src/shared/utils/sharedTypes";

interface IProps {
	rangeFrom?: Date;
	rangeTo?: Date;
}

/**
 * This class is for retrieving the feedbacks from the database.
 * The feedbacks are retrieved from the database based on the date range.
 * The date range is optional, but must be both or none.
 * If the date range is not provided, the feedbacks are retrieved from the last 1 hour.
 * @param rangeFrom
 * @param rangeTo
 * @param timestreamRepository
 */
class AnalysisSummaryUseCase
	implements IUseCase<IProps, Promise<Result<FeedbackSummary[], string>>>
{
	constructor(private readonly timestreamRepository: ITimestreamRepository) {}

	async execute(input: IProps): Promise<Result<FeedbackSummary[], string>> {
		const { rangeFrom, rangeTo } = input;

		// check the input data	range
		if (rangeFrom && !rangeTo)
			return err("Invalid date range. The range must be both or none.");
		if (!rangeFrom && rangeTo)
			return err("Invalid date range. The range must be both or none.");
		if (rangeFrom && rangeTo && rangeTo > rangeFrom)
			err("Invalid date range. The range `from` must be greater than `to`.");

		// retrieve feedbacks from the database
		if (rangeFrom && rangeTo) {
			const storedFeedback = await this.timestreamRepository.readTimeRange(
				rangeFrom,
				rangeTo,
			);
			return ok(storedFeedback);
		}

		// get data of 1 hour
		const storedFeedback = await this.timestreamRepository.readRecords(60);

		return ok(storedFeedback);
	}
}

const generateAnalysisSummaryUseCase = () => {
	if (MOCK) {
		return new AnalysisSummaryUseCase(new MockTimestreamRepository());
	}
	return new AnalysisSummaryUseCase(new TimestreamRepositoryImpl());
};

export const analysisSummaryUseCase = generateAnalysisSummaryUseCase();
