import { Hono } from 'hono'
import { handle } from 'hono/aws-lambda'
import { serve } from "@hono/node-server";

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

// This condition checks if the code is running in an AWS Lambda environment by checking the function name
// If it is, it uses the AWS Lambda handler
// If not, it starts a local server
if (process.env.AWS_LAMBDA_FUNCTION_NAME) {
  // this is lambda function handler
  exports.handler = handle(app)
} else {
  // this is local server
  console.log("Server is running on http://localhost:3000")
  serve(app)
}