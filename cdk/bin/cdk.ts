#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { FrontendStack } from "../lib/frontStack";
import { StaticContentsStack } from "../lib/staticContentsStack";

const app = new cdk.App();
const staticContentsStack = new StaticContentsStack(app, "RealtimeStatementAnalyticsStaticContentsStack");
new FrontendStack(app, "RealtimeInsightDashboardStack");
