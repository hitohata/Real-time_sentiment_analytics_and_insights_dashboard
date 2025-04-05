# Real-time Sentiment Analytics and Insights Dashboard

## Directory structure

```bash
.
|-- lambdas
|   |-- dashboardFunction
|   |-- statementFunction
|-- cdk
|-- front
|-- feedbackIngestionSimulator
```

* **lambdas**: Contains the Lambda functions for the backend.
* **cdk**: Contains the AWS CDK code for deploying the infrastructure.
* **front**: Contains the React frontend code.
* **feedbackIngestionSimulator**: Contains the script for simulating feedback ingestion.

## Requirements

### Environment

AWS CLI

### AWS

* AWS account
* AWS CLI Access Key and Secret Key

To run AWS CDK, it is required to set up the AWS CLI and credentials.
https://docs.aws.amazon.com/cdk/v2/guide/prerequisites.html#prerequisites-cli

## Architecture overview

The user of this application is a customer experience team.
The application supports two use cases:

1. **Real-time sentiment analytics**: The dashboard provides real-time insights into customer sentiment, allowing the team to monitor feedback trends and identify potential issues.
2. **Error statements analytics**: The dashboard provides a specific state based on the filter.

### Frontend

The frontend is built using React.
That is deployed on S3 and delivered via CloudFront.

![front-infrastructure](./img/aws-infrastructure-front.drawio.svg)

### Backend

![overview](./img/aws-infrastructure-overview.drawio.svg)

#### Feedback Ingestion Simulator

The feedback ingestion simulator is a script that generates new feedback entries every few seconds.
The script is run in a PC.

#### Sentiment Analysis Pipeline

The sentiment analysis pipeline is a serverless architecture that uses AWS Lambda and SQS to process feedback in real-time.
The feedbacks from users are sent to an SQS queue, then the SQS calls the StatementFunction.
The function calls the OpenAI API and analyze the sentiment of the feedback.
Then the results are stored in Amazon Timestream.

> [!NOTE]
> The reason for using SQS is to enhance the usability and scalability of the system.
> There is no guarantee of the response time from the AI; it could be longer than the connection limit of the API Gateway to a client (30 sec).
> In addition to that, the SQS can retry the failed requests.

#### Suggestions Engine

The suggestions engine extracts the most recent 50–100 feedback entries and generates actionable suggestions based on sentiment trends using ChatGPT.

#### Email Alerts/Notifications

After the feedback is analyzed, the latest timestream data is sent to the AlertAnalyticsQueue.
Then, the AlertAnalysisFunction is called.
The function retrieves 5 minutes of window data from the latest data from Timestream and checks if there are more than 5 negative sentiments.

> [!NOTE]
> The reason for avoiding email (SMS) is the deadline.
> To send an email, the users need to ask the AWS. It can take several days, depending on the situation. 
> To avoid this, the alert is sent via Discord webhook and WhatsApp.

#### API Layer

Exposes endpoints via API Gateway for fetching feedback, and returning the data.
The API is built using AWS Lambda functions.
This layer handles the feedbacks and returns the data to the frontend.
The feedback is sent to the SQS queue, which is then processed by the Lambda function. (see the Sentiment Analysis Pipeline section above)

> [!NOTE]
> To keep this system simple, the API Gateway and Lambda function are used to handle the feedbacks and requests from frontend users.
> 
> If the real-time is more important, it should use WebSocket to push data from the backend.
