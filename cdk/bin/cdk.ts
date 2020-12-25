#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CdkStack } from '../lib/cdk-stack';

const STAGE = process.env.STAGE
if (!STAGE) {
    throw new Error("STAGE is not defined")
}

const app = new cdk.App();
new CdkStack(app, `${STAGE}-h-hub`, {
    env: { 
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEPLOY_REGION || process.env.CDK_DEFAULT_REGION || 'eu-central-1',
    }
});
