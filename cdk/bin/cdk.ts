#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { FrontendStack } from "../lib/frontStack";
import { DataLayerStack } from "../lib/dataLayerStack";
import { ApplicationStack } from "../lib/applicationStack";
import { WebSocketApiStack } from "../lib/webSocketResources";

const app = new cdk.App();
const dataLayerStack = new DataLayerStack(
	app,
	"RealtimeStatementAnalyticsDataLayerStack",
);
new FrontendStack(app, "RealtimeInsightDashboardStack");
const webSocketApiStack = new WebSocketApiStack(app, "WebSocketApiStack", {
	connectionManagementTable: dataLayerStack.connectionManageTable,
});
new ApplicationStack(app, "RealtimeStatementAnalyticsApplicationStack", {
	timestreamTable: dataLayerStack.timestreamTable,
	timestreamTableName: dataLayerStack.timestreamTableName,
	timestreamDatabaseName: dataLayerStack.timestreamDatabaseName,
	connectionManagementTable: dataLayerStack.connectionManageTable,
	websocketGateway: webSocketApiStack.websocketGateway,
});
