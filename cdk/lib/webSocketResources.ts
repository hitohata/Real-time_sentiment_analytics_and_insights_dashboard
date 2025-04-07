import * as cdk from "aws-cdk-lib";
import * as apigatewayv2 from "aws-cdk-lib/aws-apigatewayv2";
import * as apigatewayv2_integrations from "aws-cdk-lib/aws-apigatewayv2-integrations";
import * as lambda from "aws-cdk-lib/aws-lambda";
import type * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as apigw from "aws-cdk-lib/aws-apigateway";
import * as nodeLambda from "aws-cdk-lib/aws-lambda-nodejs";
import type { Construct } from "constructs";
import * as path from "node:path";

interface IProps extends cdk.StackProps {
	connectionManagementTable: dynamodb.Table;
}

export class WebSocketApiStack extends cdk.Stack {
	readonly websocketGateway: apigatewayv2.WebSocketApi;
	constructor(scope: Construct, id: string, props: IProps) {
		super(scope, id, props);

		const { connectionManagementTable } = props;

		// Create Lambda function for connection handling
		const connectHandler = new nodeLambda.NodejsFunction(
			this,
			"ConnectHandler",
			{
				functionName: "RealtimeSentimentDashboardWebsocketConnectHandler",
				runtime: lambda.Runtime.NODEJS_22_X,
				handler: "handler",
				entry: path.join(__dirname, "../../utilLambda/src/index.ts"),
				depsLockFilePath: path.join(
					__dirname,
					"../../utilLambda/package-lock.json",
				),
				environment: {
					TABLE_NAME: connectionManagementTable.tableName,
				},
			},
		);

		// Grant the Lambda function write permissions to the DynamoDB table
		connectionManagementTable.grantWriteData(connectHandler);

		// Create WebSocket API
		const webSocketApi = new apigatewayv2.WebSocketApi(this, "WebSocketApi", {
			connectRouteOptions: {
				integration: new apigatewayv2_integrations.WebSocketLambdaIntegration(
					"ConnectIntegration",
					connectHandler,
				),
			},
			disconnectRouteOptions: {
				integration: new apigatewayv2_integrations.WebSocketLambdaIntegration(
					"DisconnectIntegration",
					connectHandler,
				),
			},
		});

		// Create WebSocket stage
		new apigatewayv2.WebSocketStage(this, "WebSocketStage", {
			webSocketApi,
			stageName: "prod",
			autoDeploy: true,
		});

		new cdk.CfnOutput(this, "WebSocketApiEndpoint", {
			value: `${webSocketApi.apiEndpoint}/prod`,
		});
	}
}
