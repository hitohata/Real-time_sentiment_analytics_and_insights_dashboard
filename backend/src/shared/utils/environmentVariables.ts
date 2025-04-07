import {
	GetSecretValueCommand,
	SecretsManagerClient,
} from "@aws-sdk/client-secrets-manager";

export const SENTIMENT_QUEUE_URL = process.env.SENTIMENT_QUEUE_URL || "";
export const ALERT_ANALYSIS_QUEUE_URL =
	process.env.ALERT_ANALYSIS_QUEUE_URL || "";

export const TIMRESTREAM_DATABASE_NAME =
	process.env.TIMRESTREAM_DATABASE_NAME || "";
export const TIMRESTREAM_TABLE_NAME = process.env.TIMRESTREAM_TABLE_NAME || "";

/**
 * If AWS Lambda environment exists, it means the code is running in AWS Lambda.
 */
export const MOCK = !process.env.AWS_LAMBDA_FUNCTION_NAME;

/**
 * This is to get a key from Secret Manager
 */
export const openAiKey = async (): Promise<string> => {
	const client = new SecretsManagerClient();
	const command = new GetSecretValueCommand({
		SecretId: process.env.SECRET_NAME,
	});

	const res = await client.send(command);

	// biome-ignore lint/style/noNonNullAssertion: <explanation>
	return JSON.parse(res.SecretString!).openAiKey;
};

/**
 * This is OpenAI Key for local development.
 */
export const OPENAI_API_KEY_MOCK = process.env.OPENAI_API_KEY || "";

/**
 * DynamoDB table name
 */
export const TABLE_NAME = process.env.TABLE_NAME || "";

/**
 * Websocket endpoint
 */
export const WEBSOCKET_ENDPOINT = (
	process.env.WEBSOCKET_ENDPOINT || ""
).replace("wss", "https"); // change protocol from wws to https
