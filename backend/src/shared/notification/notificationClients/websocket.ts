import {
	ApiGatewayManagementApiClient,
	PostToConnectionCommand,
	type PostToConnectionCommandInput,
} from "@aws-sdk/client-apigatewaymanagementapi";
import {
	DynamoDBClient,
	ScanCommand,
	type ScanCommandInput,
} from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import type { INotification } from "src/shared/notification/notification";
import {
	TABLE_NAME,
	WEBSOCKET_ENDPOINT,
} from "src/shared/utils/environmentVariables";

/**
 * This is websocket client
 * 1. get websocket chanel ID from DB
 * 2. push notification to the websocket channel
 */
export class WebsocketClientImpl implements INotification {
	private dynamoDBClient: DynamoDBClient;
	private apiGatewayClient: ApiGatewayManagementApiClient;
	constructor() {
		this.dynamoDBClient = new DynamoDBClient();
		this.apiGatewayClient = new ApiGatewayManagementApiClient({
			endpoint: WEBSOCKET_ENDPOINT,
		});
	}

	async sendNotification(notificationMessage: string): Promise<void> {
		const channelIds = await this.getWebsocketChannelId();
		await Promise.all(
			channelIds.map((id) => this.postToConnection(id, notificationMessage)),
		);
	}

	/**
	 * send notification to websocket channel
	 * @param channelId
	 * @param message
	 */
	private async postToConnection(
		channelId: string,
		message: string,
	): Promise<void> {
		const input: PostToConnectionCommandInput = {
			ConnectionId: channelId,
			Data: new TextEncoder().encode(
				JSON.stringify({ action: "notification", message }),
			),
		};

		console.log("endpoint", WEBSOCKET_ENDPOINT);
		console.log("postToConnection", input);

		await this.apiGatewayClient.send(new PostToConnectionCommand(input));
	}

	/**
	 * get websocket channel IDs from DB
	 * @private
	 */
	private async getWebsocketChannelId(): Promise<string[]> {
		const scanCommandInput: ScanCommandInput = {
			TableName: TABLE_NAME,
		};

		const command = new ScanCommand(scanCommandInput);

		const result = await this.dynamoDBClient.send(command);

		if (!result.Items?.length) return [];

		return result.Items.map(
			(item) => unmarshall(item).connectionId,
		) as string[];
	}
}
