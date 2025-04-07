import { serve } from "@hono/node-server";
import { handle } from "hono/aws-lambda";
import { cors } from "hono/cors";
import { MOCK } from "src/shared/utils/environmentVariables";
import { app } from "./app/route";

// if deployed to AWS Lambda, use the lambda handler
// if not, use the local server
if (MOCK) {
	// this is local server
	console.log("Server is running on http://localhost:3000");
	serve(app);
} else {
	// this is lambda function handler
	exports.handler = handle(app);
}
