#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { FrontendStack } from "../lib/frontStack";
import { DataLayerStack } from "../lib/dataLayerStack";

const app = new cdk.App();
const dataLayerStack = new DataLayerStack(app, "RealtimeStatementAnalyticsDataLayerStack");
new FrontendStack(app, "RealtimeInsightDashboardStack");
