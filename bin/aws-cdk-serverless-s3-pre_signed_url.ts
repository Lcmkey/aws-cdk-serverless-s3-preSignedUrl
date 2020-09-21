#!/usr/bin/env node
require("dotenv").config();

import "source-map-support/register";
import { App, Tags } from "@aws-cdk/core";
import { S3BucketStack, IamStack, LambdaStack, ApiGatewayStack } from "../lib";

/**
   * AWS Account / Region Definition
   */
const {
  PREFIX: prefix = "[STACK PREFIX NAME]",
  STAGE: stage = "[DEPLOYMENT STAGE]",
  CDK_ACCOUNT: accountId = "[AWS ACCOUNT ID]",
  CDK_REGION: region = "ap-southeast-1",
} = process.env;

/**
   * AWS defulat ENV config Definition
   */
const env = {
  account: accountId,
  region: region,
};

const app = new App();

/**
   * Create S3 Stack
   */
const s3bucket = new S3BucketStack(app, `${prefix}-${stage}-S3BucketStack`, {
  env,
  prefix,
  stage,
  bucketName: "sam.leung",
});

/**
   * Create IAM Stack
   */
const iam = new IamStack(app, `${prefix}-${stage}-IamStack`, {
  env,
  bucket: s3bucket.bucket,
});

/**
   * Create Lambda Stack
   */
const lambda = new LambdaStack(app, `${prefix}-${stage}-LambdaStack`, {
  env,
  prefix,
  stage,
  bucket: s3bucket.bucket,
  s3Policy: iam.s3Policy,
});

/**
   * Create Api-Gateway Stack
   */
new ApiGatewayStack(app, `${prefix}-${stage}-ApiGatewaytack`, {
  env,
  prefix,
  stage,
  presignedUrlLambFunc: lambda.presignedUrlFunction,
});
