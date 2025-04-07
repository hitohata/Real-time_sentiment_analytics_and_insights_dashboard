# Backend

This is a backend project.
This project has multiple functions that share some modules.

There are two directories under the `src` directory:

- `app`: This directory contains the unique application logic. Each application is the entry point of the lambda function.
- `shared`: This directory contains the shared modules that are used by the functions.

## Local development

> [!NOTE]
> To run this function locally, you need to have Node.js (v22) and npm installed on your machine.

This function can run locally using the `npm run start` command.

To run the function locally, you need to install the dependencies first.

```bash
npm run ci
```

## API Document

The schema is provided as a Swagger API style.
To see the schema, run this project locally and open the following URL:

`http://localhost:3000/docs`

### Environment Variables

| Name                      | Description                  |
|:--------------------------|:-----------------------------|
| SENTIMENT_QUEUE_URL       | The statement queue's URL    |
| ALERT_ANALYTICS_QUEUE_URL | The alert analysis Queue URL |
| TIMRESTREAM_DATABASE_NAME | Timestream's DB Name         |
| TIMRESTREAM_TABLE_NAME    | Timestream's Table Name      |
| WEBSOCKET_ENDPOINT        | Websocket endpoint           |
| TABLE_NAME                | DynamoDB's Table Name        |

## Prompt Test

There are scripts in the `prompt-test` directory to test the AI output.
To check the results, run the following command:

> [!NOTE]
> To run this command, you need to set an OpenAI's key to the `.env` file.

### Sentiment Analysis

```bash
npm run sentimentAnalysisTest
```

### Feedback Trend

```bash
npm run feedbackTrendTest
```
