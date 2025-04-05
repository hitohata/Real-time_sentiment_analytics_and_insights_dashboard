import type { SQSEvent } from 'aws-lambda';

export const handler = async (event: SQSEvent) => {
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Hello from Lambda!',
        }),
    };
};
