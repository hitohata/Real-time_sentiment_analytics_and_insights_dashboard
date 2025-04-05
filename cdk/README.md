# Infrastructure

This project consists of three stacks:

# 1. **Frontend**: The frontend stack contains the S3 bucket and CloudFront distribution for the frontend.
# 2. **DataLayer**: The DB layer stack.
# 3. **Backend(application)**: The backend stack contains the Lambda functions and SQS queue for processing feedback.

The reason for separating the stacks is to allow for easier management and deployment of the different components of the application.
Especially, the DB layer won't be changed often, so it is separated from the other stacks.

--

This is an auto-generated document from the CDK TypeScript project template

This is a blank project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `npx cdk deploy`  deploy this stack to your default AWS account/region
* `npx cdk diff`    compare deployed stack with current state
* `npx cdk synth`   emits the synthesized CloudFormation template
