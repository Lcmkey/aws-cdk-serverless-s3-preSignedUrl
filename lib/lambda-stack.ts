import {
  Construct,
  Stack,
  StackProps,
  CfnOutput,
  Duration,
} from "@aws-cdk/core";
import { Function, Code, Runtime, LayerVersion } from "@aws-cdk/aws-lambda";
import { PolicyStatement } from "@aws-cdk/aws-iam";
import { Bucket } from "@aws-cdk/aws-s3";

import * as path from "path";

interface LambdaStackProps extends StackProps {
  readonly prefix: string;
  readonly stage: string;
  readonly bucket: Bucket;
  readonly s3Policy: PolicyStatement;
}

class LambdaStack extends Stack {
  public readonly presignedUrlFunction: Function;

  constructor(scope: Construct, id: string, props: LambdaStackProps) {
    super(scope, id, props);

    /**
     * Get var from props
     */
    const { prefix, stage, bucket, s3Policy } = props;

    /**
     * Lambda Layer
     */
    const lambdaLayer = new LayerVersion(
      this,
      `presignedUrlLayer`,
      {
        layerVersionName: `${prefix}-${stage}-presigned-Url-Layer`,
        code: Code.fromAsset(
          path.resolve(
            __dirname,
            "..",
            "src",
            "layer",
          ),
        ),
        //   compatibleRuntimes: [Runtime.PROVIDED],
        compatibleRuntimes: [Runtime.NODEJS_10_X, Runtime.NODEJS_12_X],
        license: "Sam Leung",
        description: "Presigned Url Layer",
      },
    );

    /**
     * Lambda Func Definition
     */
    const presignedUrlFunction = new Function(this, "PresigedURLFunc", {
      functionName: `${prefix}-${stage}-Func`,
      code: Code.asset("dist/src/lambda"),
      handler: "app.handler",
      runtime: Runtime.NODEJS_12_X,
      memorySize: 128,
      timeout: Duration.seconds(10),
      layers: [lambdaLayer],
      environment: {
        "BucketName": bucket.bucketName,
      },
    });

    /**
     * Attach Policy
     */
    presignedUrlFunction.addToRolePolicy(s3Policy);

    /**
     * Assign s3 Bucket to gloabal var
     */
    this.presignedUrlFunction = presignedUrlFunction;

    /**
     * Cfn Ouput
     */
    new CfnOutput(this, "PresignedUrlLambdaFuncArn", {
      value: presignedUrlFunction.functionArn,
      description: "Lambda Function ARN",
    });

    new CfnOutput(this, "PreSignedUrlLambdaFuncIamRole", {
      value: presignedUrlFunction.role?.roleArn || "",
      description: "Implicit IAM Role created for function",
    });
  }
}

export { LambdaStack };
