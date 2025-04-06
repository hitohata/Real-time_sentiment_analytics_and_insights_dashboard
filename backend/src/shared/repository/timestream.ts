import {
	MeasureValueType,
	TimestreamQueryClient,
} from "@aws-sdk/client-timestream-query";
import {
	TimestreamWriteClient,
	WriteRecordsCommand,
	type WriteRecordsCommandInput,
	type _Record,
} from "@aws-sdk/client-timestream-write";
import {
	TIMRESTREAM_DATABASE_NAME,
	TIMRESTREAM_TABLE_NAME,
} from "src/shared/utils/environmentVariables";
import type {
	FeedbackSentiment,
	FeedbackSummary,
} from "src/shared/utils/sharedTypes";

export interface ITimestreamRepository {
	/**
	 * read feedback records from database
	 * The start point is the current time minus the timeRange
	 * The end point is the current time
	 * @param timeRange - the time range in minutes
	 */
	readRecords(timeRange: number): Promise<FeedbackSummary[]>;

	/**
	 * read feedback records by provided time range
	 * @param rangeFrom
	 * @param rangeTo
	 */
	readTimeRange(rangeFrom: Date, rangeTo: Date): Promise<FeedbackSummary[]>;

	/**
	 * return the requested number of data
	 * @param number
	 */
	readRecordByNumber(number: number): Promise<FeedbackSummary[]>;

	/**
	 * write feedback records to database
	 * @param sentimentData
	 */
	writeFeedbacks(sentimentData: FeedbackSentiment[]): Promise<void>;
}

export class TimestreamRepositoryImpl implements ITimestreamRepository {
	private readonly queryClient: TimestreamQueryClient;
	private readonly writeClient: TimestreamWriteClient;

	constructor() {
		this.queryClient = new TimestreamQueryClient({
			region: process.env.AWS_REGION,
		});
		this.writeClient = new TimestreamWriteClient({
			region: process.env.AWS_REGION,
		});
	}

	async readRecords(timeRange: number): Promise<FeedbackSummary[]> {
		return Promise.resolve([]);
	}

	async readTimeRange(from: Date, to: Date): Promise<FeedbackSummary[]> {
		return Promise.resolve([]);
	}

	readRecordByNumber(number: number): Promise<FeedbackSummary[]> {
		return Promise.resolve([]);
	}

	async writeFeedbacks(sentimentData: FeedbackSentiment[]): Promise<void> {
		// transform the data from feedback sentiment to the format that Timestream accepts
		const records: _Record[] = sentimentData.map((sentiment) => ({
			Dimensions: [
				{
					Name: "source",
					Value: sentiment.feedbackSource,
				},
			],
			MeasureName: "sentiment_data",
			MeasureValue: MeasureValueType.MULTI,
			MeasureValues: [
				{
					Name: "score",
					Value: sentiment.sentimentScore.toString(),
					Type: MeasureValueType.DOUBLE,
				},
				{
					Name: "label",
					Value: sentiment.sentimentLabel,
					Type: MeasureValueType.VARCHAR,
				},
				{
					Name: "feedback",
					Value: sentiment.feedback,
					Type: MeasureValueType.VARCHAR,
				},
				{
					Name: "user_id",
					Value: sentiment.userIdentifier,
					Type: MeasureValueType.VARCHAR,
				},
			],
			Time: new Date(sentiment.timestamp).getTime().toString(), // from ISO string to epoch time
		}));

		const params: WriteRecordsCommandInput = {
			DatabaseName: TIMRESTREAM_DATABASE_NAME,
			TableName: TIMRESTREAM_TABLE_NAME,
			Records: records,
		};

		await this.writeClient.send(new WriteRecordsCommand(params));
	}
}

export class MockTimestreamRepository implements ITimestreamRepository {
	async readRecords(timeRange: number): Promise<FeedbackSummary[]> {
		return Promise.resolve([
			{
				timestamp: "2023-10-01T12:00:00Z",
				feedbackSource: "web",
				feedback: "Great service, very satisfied!",
				sentimentLabel: "positive",
				sentimentScore: 0.9,
			},
			{
				timestamp: "2023-10-02T15:30:00Z",
				feedbackSource: "email",
				feedback: "The product quality is poor.",
				sentimentLabel: "negative",
				sentimentScore: -0.8,
			},
			{
				timestamp: "2023-10-03T09:45:00Z",
				feedbackSource: "app",
				feedback: "Delivery time was acceptable.",
				sentimentLabel: "neutral",
				sentimentScore: 0.1,
			},
			{
				timestamp: "2023-10-04T18:20:00Z",
				feedbackSource: "web",
				feedback: "Customer support was very helpful.",
				sentimentLabel: "positive",
				sentimentScore: 0.7,
			},
			{
				timestamp: "2023-10-05T11:10:00Z",
				feedbackSource: "email",
				feedback: "An average experience.",
				sentimentLabel: "neutral",
				sentimentScore: 0.0,
			},
			{
				timestamp: "2023-10-06T14:00:00Z",
				feedbackSource: "app",
				feedback: "The interface is confusing.",
				sentimentLabel: "negative",
				sentimentScore: -0.5,
			},
			{
				timestamp: "2023-10-07T08:30:00Z",
				feedbackSource: "web",
				feedback: "Fantastic value for money.",
				sentimentLabel: "positive",
				sentimentScore: 0.8,
			},
			{
				timestamp: "2023-10-08T16:45:00Z",
				feedbackSource: "email",
				feedback: "The team was unresponsive.",
				sentimentLabel: "negative",
				sentimentScore: -0.7,
			},
			{
				timestamp: "2023-10-09T10:15:00Z",
				feedbackSource: "app",
				feedback: "Met my expectations.",
				sentimentLabel: "neutral",
				sentimentScore: 0.2,
			},
			{
				timestamp: "2023-10-10T13:50:00Z",
				feedbackSource: "web",
				feedback: "The product works perfectly.",
				sentimentLabel: "positive",
				sentimentScore: 0.9,
			},
		]);
	}

	async readTimeRange(from: Date, to: Date): Promise<FeedbackSummary[]> {
		return Promise.resolve([
			{
				timestamp: "2023-11-01T10:00:00Z",
				feedbackSource: "web",
				feedback: "Amazing product, exceeded my expectations!",
				sentimentLabel: "positive",
				sentimentScore: 0.95,
			},
			{
				timestamp: "2023-11-02T14:30:00Z",
				feedbackSource: "email",
				feedback: "The delivery was delayed.",
				sentimentLabel: "negative",
				sentimentScore: -0.6,
			},
			{
				timestamp: "2023-11-03T08:45:00Z",
				feedbackSource: "app",
				feedback: "User interface is user-friendly.",
				sentimentLabel: "positive",
				sentimentScore: 0.8,
			},
			{
				timestamp: "2023-11-04T17:20:00Z",
				feedbackSource: "web",
				feedback: "Support team was not helpful.",
				sentimentLabel: "negative",
				sentimentScore: -0.7,
			},
			{
				timestamp: "2023-11-05T12:10:00Z",
				feedbackSource: "email",
				feedback: "Overall, a decent experience.",
				sentimentLabel: "neutral",
				sentimentScore: 0.2,
			},
			{
				timestamp: "2023-11-06T15:00:00Z",
				feedbackSource: "app",
				feedback: "The app crashes frequently.",
				sentimentLabel: "negative",
				sentimentScore: -0.9,
			},
			{
				timestamp: "2023-11-07T09:30:00Z",
				feedbackSource: "web",
				feedback: "Great value for the price.",
				sentimentLabel: "positive",
				sentimentScore: 0.85,
			},
			{
				timestamp: "2023-11-08T18:45:00Z",
				feedbackSource: "email",
				feedback: "The product did not meet my expectations.",
				sentimentLabel: "negative",
				sentimentScore: -0.4,
			},
			{
				timestamp: "2023-11-09T11:15:00Z",
				feedbackSource: "app",
				feedback: "Satisfied with the purchase.",
				sentimentLabel: "positive",
				sentimentScore: 0.7,
			},
			{
				timestamp: "2023-11-10T14:50:00Z",
				feedbackSource: "web",
				feedback: "The product is just okay.",
				sentimentLabel: "neutral",
				sentimentScore: 0.1,
			},
		]);
	}

	readRecordByNumber(number: number): Promise<FeedbackSummary[]> {
		return Promise.resolve([
			{
				timestamp: "2023-11-01T10:00:00Z",
				feedbackSource: "web",
				feedback: "Amazing product, exceeded my expectations!",
				sentimentLabel: "positive",
				sentimentScore: 0.95,
			},
			{
				timestamp: "2023-11-02T14:30:00Z",
				feedbackSource: "email",
				feedback: "The delivery was delayed.",
				sentimentLabel: "negative",
				sentimentScore: -0.6,
			},
			{
				timestamp: "2023-11-03T08:45:00Z",
				feedbackSource: "app",
				feedback: "User interface is user-friendly.",
				sentimentLabel: "positive",
				sentimentScore: 0.8,
			},
			{
				timestamp: "2023-11-04T17:20:00Z",
				feedbackSource: "web",
				feedback: "Support team was not helpful.",
				sentimentLabel: "negative",
				sentimentScore: -0.7,
			},
			{
				timestamp: "2023-11-05T12:10:00Z",
				feedbackSource: "email",
				feedback: "Overall, a decent experience.",
				sentimentLabel: "neutral",
				sentimentScore: 0.2,
			},
			{
				timestamp: "2023-11-06T15:00:00Z",
				feedbackSource: "app",
				feedback: "The app crashes frequently.",
				sentimentLabel: "negative",
				sentimentScore: -0.9,
			},
			{
				timestamp: "2023-11-07T09:30:00Z",
				feedbackSource: "web",
				feedback: "Great value for the price.",
				sentimentLabel: "positive",
				sentimentScore: 0.85,
			},
			{
				timestamp: "2023-11-08T18:45:00Z",
				feedbackSource: "email",
				feedback: "The product did not meet my expectations.",
				sentimentLabel: "negative",
				sentimentScore: -0.4,
			},
			{
				timestamp: "2023-11-09T11:15:00Z",
				feedbackSource: "app",
				feedback: "Satisfied with the purchase.",
				sentimentLabel: "positive",
				sentimentScore: 0.7,
			},
			{
				timestamp: "2023-11-10T14:50:00Z",
				feedbackSource: "web",
				feedback: "The product is just okay.",
				sentimentLabel: "neutral",
				sentimentScore: 0.1,
			},
		]);
	}

	async writeFeedbacks(sentimentData: FeedbackSentiment[]): Promise<void> {
		console.log("received feedbacks", sentimentData);
	}
}
