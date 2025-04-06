export interface INotification {
	/**
	 * send a notification to the users
	 * @param notificationMessage
	 */
	sendNotification(notificationMessage: string): Promise<void>;
}

/**
 * This is the implementation of the notification service
 * This one can contain other notifications services.
 * Those services must be implement `INotification` are stored as a list in this class.
 * Once the `sendNotification` method is  called, it will call all the services in the list
 */
export class NotificationImpl implements INotification {
	private readonly notificationServices: INotification[];

	constructor(notificationServices: INotification[]) {
		this.notificationServices = notificationServices;
	}

	async sendNotification(notificationMessage: string): Promise<void> {
		await Promise.all(
			this.notificationServices.map((service) =>
				service.sendNotification(notificationMessage),
			),
		);
	}
}

export class MockNotification implements INotification {
	async sendNotification(notificationMessage: string): Promise<void> {
		return Promise.resolve();
	}
}
