import * as cdk from "aws-cdk-lib";
import type { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as lambdaNodejs from "aws-cdk-lib/aws-lambda-nodejs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as iam from "aws-cdk-lib/aws-iam";
import * as sqs from "aws-cdk-lib/aws-sqs";
import * as path from "node:path";
import type { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { SqsEventSource } from "aws-cdk-lib/aws-lambda-event-sources";

interface IProps extends cdk.StackProps {
	timestreamTable: cdk.aws_timestream.CfnTable;
	timestreamDatabaseName: string;
	timestreamTableName: string;
}

export class ApplicationStack extends cdk.Stack {
	private readonly timestreamTable: cdk.aws_timestream.CfnTable;
	private readonly timestreamTableName: string;
	private readonly timestreamDatabaseName: string;

	constructor(scope: Construct, id: string, props: IProps) {
		super(scope, id, props);

		this.timestreamTable = props.timestreamTable;
		this.timestreamDatabaseName = props.timestreamDatabaseName;
		this.timestreamTableName = props.timestreamTableName;

		// Create the Lambda function for Dashboard
		const dashboardFunction = this.dashboardFunctionSettings();

		// Create the Lambda function for Statement
		const sentimentFunction = this.sentimentFunctionSettings();

		// Create the Lambda function for Alert Analysis
		const alertAnalysisFunction = this.alertAnalysisFunctionSettings();

		// Create the API Gateway
		this.dashboardRestApiGateway(dashboardFunction);

		// Add sentiment sqs queue
		this.sentimentAnalysisQueue({
			producerFunction: dashboardFunction,
			consumerFunction: sentimentFunction,
		});
		// Add alert sqs queue
		this.alertAnalysisQueue({
			producerFunction: sentimentFunction,
			consumerFunction: alertAnalysisFunction,
		});

		// Add a policy to readonly access the Timestream database
		this.addReadTimestreamAuthority([dashboardFunction, alertAnalysisFunction]);
		// Add a policy to write-only access the Timestream database
		this.addWriteTimestreamAuthority(sentimentFunction);
	}

	/**
	 * This function creates the Lambda function for Dashboard
	 * @private
	 */
	private dashboardFunctionSettings(): NodejsFunction {
		return new lambdaNodejs.NodejsFunction(this, "DashboardFunction", {
			functionName: "RealTimeInsightsStatementDashboardFunction",
			runtime: lambda.Runtime.NODEJS_22_X,
			timeout: cdk.Duration.seconds(10),
			handler: "handler",
			entry: path.join(__dirname, "../../backend/src/app/dashboard/index.ts"),
			depsLockFilePath: path.join(__dirname, "../../backend/package-lock.json"),
			environment: {
				TIMRESTREAM_DATABASE_NAME: this.timestreamDatabaseName,
				TIMRESTREAM_TABLE_NAME: this.timestreamTableName,
			},
		});
	}
	/**
	 * This function creates the Lambda function for Statement
	 * @private
	 */
	private sentimentFunctionSettings(): NodejsFunction {
		return new lambdaNodejs.NodejsFunction(this, "StatementFunction", {
			functionName: "RealTimeInsightsStatementAnalysisFunction",
			timeout: cdk.Duration.seconds(30),
			runtime: lambda.Runtime.NODEJS_22_X,
			handler: "handler",
			entry: path.join(
				__dirname,
				"../../backend/src/app/sentimentAnalysis/index.ts",
			),
			depsLockFilePath: path.join(__dirname, "../../backend/package-lock.json"),
			environment: {
				TIMRESTREAM_DATABASE_NAME: this.timestreamDatabaseName,
				TIMRESTREAM_TABLE_NAME: this.timestreamTableName,
			},
		});
	}

	private alertAnalysisFunctionSettings(): NodejsFunction {
		return new lambdaNodejs.NodejsFunction(this, "AlertAnalysisFunction", {
			functionName: "RealTimeAlertAnalysisFunction",
			timeout: cdk.Duration.seconds(30),
			runtime: lambda.Runtime.NODEJS_22_X,
			handler: "handler",
			entry: path.join(
				__dirname,
				"../../backend/src/app/alertAnalysis/index.ts",
			),
			depsLockFilePath: path.join(__dirname, "../../backend/package-lock.json"),
			environment: {
				TIMRESTREAM_DATABASE_NAME: this.timestreamDatabaseName,
				TIMRESTREAM_TABLE_NAME: this.timestreamTableName,
			},
		});
	}

	/**
	 * This is the Rest API Gateway for the application
	 * This gateway integrates with the Lambda functions
	 * @private
	 */
	private dashboardRestApiGateway(lambdaFunction: NodejsFunction) {
		new apigateway.LambdaRestApi(this, "ApiGateway", {
			restApiName: "RealTimeInsightsApiGateway",
			handler: lambdaFunction,
			proxy: true,
		});
	}

	/**
	 * This function creates the SQS queue.
	 * This queue couples the producer function and the consumer functions
	 * This function attaches the appropriate role to the producer function
	 * @param producerFunction
	 * @param consumerFunction
	 * @private
	 */
	private sentimentAnalysisQueue({
		producerFunction,
		consumerFunction,
	}: {
		producerFunction: NodejsFunction;
		consumerFunction: NodejsFunction;
	}) {
		const sentimentQueue = new sqs.Queue(this, "SentimentQueue", {
			queueName: "RealTimeSentimentQueue.fifo",
			visibilityTimeout: cdk.Duration.seconds(60),
			fifo: true,
			contentBasedDeduplication: true,
		});

		consumerFunction.addEventSource(
			new SqsEventSource(sentimentQueue, {
				batchSize: 10,
				reportBatchItemFailures: true,
			}),
		);

		// Grant the producer function permissions to send messages to the SQS queue
		sentimentQueue.grantConsumeMessages(consumerFunction);
		sentimentQueue.grantSendMessages(producerFunction);

		// Add an environment variable to the producer function
		producerFunction.addEnvironment(
			"SENTIMENT_QUEUE_URL",
			sentimentQueue.queueUrl,
		);
	}

	/**
	 * This function creates the SQS queue.
	 * This queue couples the producer function and the consumer functions
	 * This function attaches the appropriate role to the producer function
	 * @param producerFunction
	 * @param consumerFunction
	 * @private
	 */
	private alertAnalysisQueue({
		producerFunction,
		consumerFunction,
	}: {
		producerFunction: NodejsFunction;
		consumerFunction: NodejsFunction;
	}) {
		const alertAnalysisQueue = new sqs.Queue(this, "AlertQueue", {
			queueName: "AlertQueue.fifo",
			visibilityTimeout: cdk.Duration.seconds(60),
			fifo: true,
			contentBasedDeduplication: true,
		});

		consumerFunction.addEventSource(
			new SqsEventSource(alertAnalysisQueue, {
				batchSize: 1,
				reportBatchItemFailures: true,
			}),
		);

		// Grant the producer function permissions to send messages to the SQS queue
		alertAnalysisQueue.grantConsumeMessages(consumerFunction);
		alertAnalysisQueue.grantSendMessages(producerFunction);

		// Add an environment variable to the producer function
		producerFunction.addEnvironment(
			"ALERT_ANALYSIS_QUEUE_URL",
			alertAnalysisQueue.queueUrl,
		);
	}

	/**
	 * This function create a policy to access the timestream database,
	 * and attach it to the lambda function.
	 * @param lambdaFunctions
	 * @private
	 */
	private addReadTimestreamAuthority(lambdaFunctions: NodejsFunction[]) {
		const processTimestreamFunctionPolicy = new iam.PolicyDocument({
			statements: [
				new iam.PolicyStatement({
					effect: iam.Effect.ALLOW,
					actions: ["timestream:Select"],
					resources: [this.timestreamTable.attrArn],
				}),
				new iam.PolicyStatement({
					effect: iam.Effect.ALLOW,
					actions: ["timestream:DescribeEndpoints"],
					resources: ["*"],
				}),
			],
		});

		for (const [i, lambdaFunction] of lambdaFunctions.entries()) {
			lambdaFunction.role?.attachInlinePolicy(
				new iam.Policy(this, `ReadTimestreamPolicy${i}`, {
					document: processTimestreamFunctionPolicy,
				}),
			);
		}
	}

	/**
	 * This function create a policy to access the timestream database,
	 * and attach it to the lambda function.
	 * @private
	 * @param lambdaFunction
	 */
	private addWriteTimestreamAuthority(lambdaFunction: NodejsFunction) {
		const processTimestreamFunctionPolicy = new iam.PolicyDocument({
			statements: [
				new iam.PolicyStatement({
					effect: iam.Effect.ALLOW,
					actions: ["timestream:WriteRecords"],
					resources: [this.timestreamTable.attrArn],
				}),
				new iam.PolicyStatement({
					effect: iam.Effect.ALLOW,
					actions: ["timestream:DescribeEndpoints"],
					resources: ["*"],
				}),
			],
		});

		lambdaFunction.role?.attachInlinePolicy(
			new iam.Policy(this, "WriteTimestreamPolicy", {
				document: processTimestreamFunctionPolicy,
			}),
		);
	}
}
