import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';

export class CdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new lambda.Function(scope, 'AssociationParser', {
      code: lambda.Code.fromAsset('dist/association-parser'),
      handler: 'main.handler',
      runtime: lambda.Runtime.NODEJS_12_X,
    })
  }
}
