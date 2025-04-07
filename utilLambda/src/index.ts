import {
	DeleteItemCommand,
	type DeleteItemCommandInput,
	DynamoDBClient,
	UpdateItemCommand,
	type UpdateItemInput,
} from "@aws-sdk/client-dynamodb";
import type { APIGatewayProxyWebsocketEventV2 } from "aws-lambda";
import { marshall } from "@aws-sdk/util-dynamodb";

export const handler = async (event: APIGatewayProxyWebsocketEventV2) => {
	const { connectionId } = event.requestContext;

	try {
		const dynamoDb = new DynamoDBClient({ region: process.env.AWS_REGION });

		// When a client connects, the connectionId is stored
		if (event.requestContext.eventType === "CONNECT") {
			const params: UpdateItemInput = {
				TableName: process.env.TABLE_NAME,
				Key: marshall({
					connectionId: connectionId,
				}),
			};

			const command = new UpdateItemCommand(params);

			await dynamoDb.send(command);
		} else {
			// When a client disconnects, the connectionId is removed
			const params: DeleteItemCommandInput = {
				TableName: process.env.TABLE_NAME,
				Key: marshall({
					connectionId: connectionId,
				}),
			};

			const command = new DeleteItemCommand(params);

			await dynamoDb.send(command);
		}

		return { statusCode: 200, body: "Connected." };
	} catch (err) {
		return {
			statusCode: 500,
			// biome-ignore lint/style/useTemplate: <explanation>
			body: "Failed to disconnect: " + JSON.stringify(err),
		};
	}
};
