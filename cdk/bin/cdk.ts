#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { FrontendStack } from "../lib/frontStack";

const app = new cdk.App();
new FrontendStack(app, "RealtimeInsightDashboardStack");
