import * as sfn from "@aws-cdk/aws-stepfunctions";
import * as task from "@aws-cdk/aws-stepfunctions-tasks";

import { CdkStack } from "../cdk-stack";

export function run(scope: CdkStack, name: string, props: sfn.StateMachineProps): sfn.StateMachine {
    return new sfn.StateMachine(scope, name, props)
}

export function invoke(scope: CdkStack, name: string, props: task.LambdaInvokeProps): task.LambdaInvoke {
    return new task.LambdaInvoke(scope, name, props)
}

