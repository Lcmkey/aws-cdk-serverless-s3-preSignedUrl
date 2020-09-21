import {
  App,
  Construct,
  Stack,
  StackProps,
  CfnOutput,
  Duration,
  RemovalPolicy,
} from "@aws-cdk/core";
import { Function, Code, Runtime } from "@aws-cdk/aws-lambda";
import { PolicyStatement } from "@aws-cdk/aws-iam";
import { Bucket, HttpMethods } from "@aws-cdk/aws-s3";

interface S3BucketStackProps extends StackProps {
  readonly prefix: string;
  readonly stage: string;
  readonly bucketName: string;
}

class S3BucketStack extends Stack {
  public bucket: Bucket;

  constructor(scope: Construct, id: string, props: S3BucketStackProps) {
    super(scope, id, props);

    /**
     * Get var from props
     */
    const { prefix, stage, bucketName } = props;

    /**
       * Create S3 Bucket
       */
    const s3Bucket = new Bucket(
      this,
      `bucket`,
      {
        bucketName:
          `${prefix.toLowerCase()}-${stage.toLowerCase()}-${bucketName.toLowerCase()}-bucket`,
        cors: [{
          allowedHeaders: ["*"],
          allowedMethods: [
            HttpMethods.GET,
            HttpMethods.PUT,
            HttpMethods.POST,
            HttpMethods.DELETE,
            HttpMethods.HEAD,
          ],
          allowedOrigins: ["*"],
        }],
        // websiteIndexDocument: "index.html",
        // websiteErrorDocument: "error.html",
        // publicReadAccess: true,
        /**
         * The default removal policy is RETAIN, which means that cdk destroy will not attempt to delete
         * the new bucket, and it will remain in your account until manually deleted. By setting the policy to
         * DESTROY, cdk destroy will attempt to delete the bucket, but will error if the bucket is not empty.
         */
        removalPolicy: RemovalPolicy.DESTROY, // NOT recommended for production code
      },
    );

    /**
     * Assign s3 Bucket to gloabal var
     */
    this.bucket = s3Bucket;

    /**
     * Cfn Ouput
     */
    new CfnOutput(this, "S3BucketArn", {
      value: s3Bucket.bucketArn,
      description: "S3 bucket Arn",
    });
  }
}

export { S3BucketStack };
