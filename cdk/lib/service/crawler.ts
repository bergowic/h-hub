import { CdkStack } from "../cdk-stack";
import { getLambdaFromApp } from "../infrastructure/lambda";

import { invoke, run } from "../infrastructure/stepfunction";

interface Task {
    app: string,
    description: string,
}

const ASSOCIATION_PARSER = {
    app: "association-parser",
    description: "Parse association",
}

function getInvoke(scope: CdkStack, task: Task) {
    const lambda = getLambdaFromApp(scope, task.app)

    return invoke(scope, task.description, {
        lambdaFunction: lambda,
    })
} 

function parseAssociation(scope: CdkStack) {
    return getInvoke(scope, ASSOCIATION_PARSER)
}

export function createCrawler(scope: CdkStack) {
    return run(scope, "GamesCrawler", {
        definition: parseAssociation(scope)
    })
}
