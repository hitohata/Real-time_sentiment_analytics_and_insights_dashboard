// biome-ignore lint/style/noNonNullAssertion: <explanation>
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;
// biome-ignore lint/style/noNonNullAssertion: <explanation>
export const SENTIMENT_QUEUE_URL = process.env.SENTIMENT_QUEUE_URL!;
export const ALERT_ANALYSIS_QUEUE_URL = process.env.ALERT_ANALYSIS_QUEUE_URL;

/**
 * If AWS Lambda environment exists, it means the code is running in AWS Lambda.
 */
export const MOCK = !process.env.AWS_LAMBDA_FUNCTION_NAME;
