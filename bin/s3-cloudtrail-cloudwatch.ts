#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { CloudWatchLogStack } from "../lib/s3-cloudtrail-cloudwatch-stack";

const app = new cdk.App();

new CloudWatchLogStack(app, "CloudWatchLogDemo", {
  bucketName: `sagemaker-${process.env.CDK_DEFAULT_REGION}-${process.env.CDK_DEFAULT_ACCOUNT}`,
});
