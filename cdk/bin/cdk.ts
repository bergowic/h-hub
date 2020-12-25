#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CdkStack } from '../lib/cdk-stack';

const CLOUD = process.env.CLOUD
if (!CLOUD) {
    throw new Error("CLOUD is not defined")
}

const app = new cdk.App();
new CdkStack(app, `${CLOUD}-h-hub`, {
    env: { 
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEPLOY_REGION || process.env.CDK_DEFAULT_REGION || 'eu-central-1',
    }
});
