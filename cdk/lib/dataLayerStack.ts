import * as cdk from "aws-cdk-lib";
import * as timestream from "aws-cdk-lib/aws-timestream";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import type { Construct } from "constructs";
import { RemovalPolicy } from "aws-cdk-lib";

/**
 * This stack creates Timestream and DynamoDB instances.
 */
export class DataLayerStack extends cdk.Stack {
	public timestreamDatabase: timestream.CfnDatabase;
	public timestreamTable: timestream.CfnTable;
	public dynamoTable: dynamodb.Table;

	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		this.timestreamDatabaseSettings();
		this.statementAnalysisTableSettings();
	}

	/**
	 * create Timestream database and table
	 * @private
	 */
	private timestreamDatabaseSettings() {
		const timestreamDatabaseName = "RealTimeInsightsDB";

		// Create a Timestream database
		this.timestreamDatabase = new timestream.CfnDatabase(
			this,
			"TimestreamDatabase",
			{
				databaseName: timestreamDatabaseName,
			},
		);
		this.timestreamDatabase.applyRemovalPolicy(RemovalPolicy.DESTROY);

		this.timestreamTable = new timestream.CfnTable(this, "TimestreamTable", {
			databaseName: timestreamDatabaseName,
			tableName: "RealTimeInsightsTable",
			retentionProperties: {
				memoryStoreRetentionPeriodInHours: "1",
				magneticStoreRetentionPeriodInDays: "1",
			},
		});
		this.timestreamTable.node.addDependency(this.timestreamDatabase);
		this.timestreamTable.applyRemovalPolicy(RemovalPolicy.DESTROY);
	}

	/**
	 * create DynamoDB table for statement analysis
	 * @private
	 */
	private statementAnalysisTableSettings() {
		this.dynamoTable = new dynamodb.Table(this, "DynamoTable", {
			tableName: "RealTimeInsightsTable",
			partitionKey: { name: "Statement", type: dynamodb.AttributeType.STRING },
			sortKey: { name: "Timestamp", type: dynamodb.AttributeType.STRING },
			billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
			removalPolicy: cdk.RemovalPolicy.DESTROY,
		});
	}
}
