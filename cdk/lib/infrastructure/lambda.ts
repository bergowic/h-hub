import * as lambda from "@aws-cdk/aws-lambda";

import { CdkStack } from "../cdk-stack";
import { APPS_PATH } from "../constants";
import { getCfnNameFromApp } from "../utils";

interface LambdaProps {
    code: lambda.Code,
    handler?: string,
    runtime?: lambda.Runtime,
}

export function getLambda(scope: CdkStack, name: string, props: LambdaProps): lambda.Function {
    return new lambda.Function(scope, name, {
        handler: props.handler ?? 'main.handler',
        code: props.code,
        runtime: props.runtime ?? lambda.Runtime.NODEJS_12_X,
    })
}

export function getCodeFromApp(app: string): lambda.Code {
    return lambda.Code.fromAsset(`${APPS_PATH}/${app}`)
}

export function getLambdaFromApp(scope: CdkStack, app: string): lambda.Function {
    const cfnName = getCfnNameFromApp(app)
    const code = getCodeFromApp(app)

    return getLambda(scope, cfnName, {
        code: code,
    })
}
