import {
  App,
  Construct,
  Stack,
  StackProps,
  CfnOutput,
} from "@aws-cdk/core";
import { RestApi, LambdaIntegration } from "@aws-cdk/aws-apigateway";
import { Function } from "@aws-cdk/aws-lambda";

interface ApiGatewayStackProps extends StackProps {
  readonly prefix: string;
  readonly stage: string;
  readonly presignedUrlLambFunc: Function;
}

class ApiGatewayStack extends Stack {
  constructor(scope: App, id: string, props: ApiGatewayStackProps) {
    super(scope, id, props);

    /**
     * Get Var from props
     */
    const { prefix, stage, presignedUrlLambFunc } = props;

    /**
         * The code that defines your stack goes here
         */
    const api = new RestApi(this, "Api", {
      restApiName: `${prefix}-${stage}-Rest-Api`,
      defaultCorsPreflightOptions: {
        allowMethods: ["OPTIONS", "GET"],
        allowHeaders: ["Content-Type"],
        allowOrigins: ["*"],
      },
    });

    const integration = new LambdaIntegration(presignedUrlLambFunc, {});
    api.root.addMethod("GET", integration);
  }
}

export { ApiGatewayStack };
