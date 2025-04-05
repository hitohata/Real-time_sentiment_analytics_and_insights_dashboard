import * as cdk from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as cloudFrontOrigins from "aws-cdk-lib/aws-cloudfront-origins";
import type { Construct } from "constructs";

/**
 * This is the frontend stack for the application.
 * It creates an S3 bucket to host the frontend files and a CloudFront distribution to serve them.
 */
export class FrontendStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		// Create an S3 bucket for hosting the frontend
		const bucket = new s3.Bucket(this, "FrontendBucket", {
			bucketName: "real-time-insights-dashboard",
			websiteIndexDocument: "index.html",
			websiteErrorDocument: "index.html",
			publicReadAccess: true,
			blockPublicAccess: {
				blockPublicAcls: false,
				blockPublicPolicy: false,
				ignorePublicAcls: false,
				restrictPublicBuckets: false,
			},
			removalPolicy: cdk.RemovalPolicy.DESTROY, // NOT recommended for production code
		});

		const bucketOrigin = new cloudFrontOrigins.S3StaticWebsiteOrigin(bucket);

		const distribution = new cloudfront.Distribution(
			this,
			"ApplicationDistribution",
			{
				defaultBehavior: {
					origin: bucketOrigin,
					viewerProtocolPolicy:
						cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
					allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD,
				},
			},
		);

		// Output the CloudFront URL
		new cdk.CfnOutput(this, "Front URL", {
			value: `https://${distribution.distributionDomainName}`,
		});
	}
}
