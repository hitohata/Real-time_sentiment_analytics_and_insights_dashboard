export interface IAlertAnalysisQueue {
	/**
	 * put the datetime that is the starting point of time to analyze the feedbacks
	 * @param datetime
	 */
	requestAnalysis(datetime: Date): Promise<boolean>;

	/**
	 * remove the queue item from the queue
	 * @param id
	 */
	deleteQueue(id: string): Promise<boolean>;

	/**
	 * put the queue item back to the queue
	 * @param id
	 */
	failureQueue(id: string): Promise<boolean>;
}

export class AlertAnalysisQueueImplementation implements IAlertAnalysisQueue {
	constructor(private queueUrl: string) {}
	async requestAnalysis(datetime: Date): Promise<boolean> {
		// TODO: Implement the logic
		return true;
	}

	deleteQueue(id: string): Promise<boolean> {
		return Promise.resolve(false);
	}

	failureQueue(id: string): Promise<boolean> {
		return Promise.resolve(false);
	}
}

export class MockAlertAnalysisQueue implements IAlertAnalysisQueue {
	async requestAnalysis(datetime: Date): Promise<boolean> {
		return true;
	}

	deleteQueue(id: string): Promise<boolean> {
		return Promise.resolve(false);
	}

	failureQueue(id: string): Promise<boolean> {
		return Promise.resolve(false);
	}
}
