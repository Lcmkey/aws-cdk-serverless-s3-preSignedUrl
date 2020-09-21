# Welcome to your CDK TypeScript project!

This is a blank project for TypeScript development with CDK.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template


# How to Deploy

### Steps

1. List all Stacks

```sh
$ cdk list
```

output:
```
SERVERLESS-PRESIGNED-URL-Dev-IamStack
SERVERLESS-PRESIGNED-URL-Dev-S3BucketStack
SERVERLESS-PRESIGNED-URL-Dev-LambdaStack
SERVERLESS-PRESIGNED-URL-Dev-ApiGatewaytack
```
2. Build file
```sh
$ npm run build
```

3. Deploy S3 Stack

```sh
$ cdk deploy SERVERLESS-PRESIGNED-URL-Dev-S3BucketStack
```
４. Deploy IAM Stck
```sh
$ cdk deploy SERVERLESS-PRESIGNED-URL-Dev-IamStack
```

5. Deploy Lambda Stack
```sh
$ cdk deploy SERVERLESS-PRESIGNED-URL-Dev-LambdaStack
```

6. Deploy Api-Gateway Stack
```sh
$ cdk deploy SERVERLESS-PRESIGNED-URL-Dev-ApiGatewaytack
```

# Test

Use `imsonnia` / `postman` choose `PUT` request method body (Binary file)
