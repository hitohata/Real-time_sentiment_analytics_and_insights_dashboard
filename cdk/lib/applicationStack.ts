import * as cdk from "aws-cdk-lib";
import type { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as lambdaNodejs from "aws-cdk-lib/aws-lambda-nodejs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as sqs from "aws-cdk-lib/aws-sqs";
import * as path from "node:path";

export class ApplicationStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		// Create the Lambda function for Dashboard
		const dashboardFunction = new lambdaNodejs.NodejsFunction(
			this,
			"DashboardFunction",
			{
				functionName: "RealTimeInsightsStatementDashboardFunction",
				runtime: lambda.Runtime.NODEJS_22_X,
				handler: "index.handler",
				entry: path.join(
					__dirname,
					"../../lambdas/dashboardFunction/src/index.ts",
				),
			},
		);

		// Create the Lambda function for Statement
		const statementFunction = new lambda.Function(this, "StatementFunction", {
			functionName: "RealTimeInsightsStatementAnalysisFunction",
			runtime: lambda.Runtime.NODEJS_22_X,
			handler: "index.handler",
            entry: path.join(
                __dirname,
                "../../lambdas/dashboardFunction/src/index.ts",
            ),
		});

		// Create the API Gateway
		const api = new apigateway.RestApi(this, "ApiGateway", {
			restApiName: "API Service",
			description: "This service serves APIs.",
		});

		// Integrate the API Gateway with the Dashboard Lambda function
		const dashboardIntegration = new apigateway.LambdaIntegration(
			dashboardFunction,
		);
		api.root.addResource("dashboard").addMethod("GET", dashboardIntegration);

		// Integrate the API Gateway with the Statement Lambda function
		const statementIntegration = new apigateway.LambdaIntegration(
			statementFunction,
		);
		api.root.addResource("statement").addMethod("GET", statementIntegration);

		// Create the SQS queue
		const statementQueue = new sqs.Queue(this, "StatementQueue", {
			visibilityTimeout: cdk.Duration.seconds(300),
		});

		// Grant the Statement Lambda function permissions to send messages to the SQS queue
		statementQueue.grantSendMessages(statementFunction);
	}
}

const app = new cdk.App();
new ApplicationStack(app, "ApplicationStack");
