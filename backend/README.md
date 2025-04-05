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

| Name                          | Description                  |
|:------------------------------|:-----------------------------|
| STATEMENT_QUEUE_URL[^1]       | The statement queue's URL    |
| ALERT_ANALYTICS_QUEUE_URL[^2] | The alert analysis Queue URL |

[^1]: `DashboardFunction` only.
[^2]: `StatementFunction` only.

## Prompt Test

There are scripts in the `prompt-test` directory to test the AI output.
To check the results, run the following command:

> [!NOTE]
> To run this command, you need to set an OpenAI's key to the `.env` file.

### Statement Analysis

```bash
npm run statementAnalysisTest
```

### Feedback Trend

```bash
npm run feedbackTrendTest
```
