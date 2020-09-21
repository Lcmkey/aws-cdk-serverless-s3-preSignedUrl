import {
  Construct,
  Stack,
  StackProps,
  CfnOutput,
} from "@aws-cdk/core";
import { PolicyStatement } from "@aws-cdk/aws-iam";
import { Bucket } from "@aws-cdk/aws-s3";

interface IamStackProps extends StackProps {
  readonly bucket: Bucket;
}

class IamStack extends Stack {
  public readonly s3Policy: PolicyStatement;

  constructor(scope: Construct, id: string, props: IamStackProps) {
    super(scope, id, props);

    /**
       * Get var from props
       */
    const { bucket } = props;

    const s3Policy = new PolicyStatement({
      actions: [
        "s3:GetObject",
        "s3:PutObject",
      ],
      resources: [
        `${bucket.bucketArn}/*`,
      ],
    });

    /**
     * Assign s3 Bucket to gloabal var
     */
    this.s3Policy = s3Policy;
  }
}

export { IamStack };
