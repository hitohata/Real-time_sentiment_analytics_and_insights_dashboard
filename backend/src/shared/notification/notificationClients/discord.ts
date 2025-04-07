import type { INotification } from "src/shared/notification/notification";
import { discordUrl } from "src/shared/utils/environmentVariables";

export class DiscordNotificationImpl implements INotification {
	private webhookUrl: string | null = null;

	constructor() {
		this.webhookUrl = null;
	}

	async sendNotification(notificationMessage: string): Promise<void> {
		if (this.webhookUrl === null) {
			this.webhookUrl = await discordUrl();
		}

		const response = await fetch(this.webhookUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				content: notificationMessage,
			}),
		});

		if (!response.ok) {
			throw new Error(`Failed to send notification: ${response.statusText}`);
		}
	}
}
