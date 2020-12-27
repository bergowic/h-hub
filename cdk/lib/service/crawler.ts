import * as lambda from "@aws-cdk/aws-lambda";

import { CdkStack } from "../cdk-stack";
import { getLambdaFromApp } from "../infrastructure/lambda";

import { invoke, map, run } from "../infrastructure/stepfunction";

interface Task {
    app: string,
    description: string,
}

const BASE_ORGANISATION_PARSER = {
    app: "organisation-parser",
    description: "Parse base organisation",
}

const lambdas: {[key: string]: lambda.Function} = {}
function getLambda(scope: CdkStack, app: string) {
    if (!lambdas[app]) {
        lambdas[app] = getLambdaFromApp(scope, app)
    }

    return lambdas[app]
}

function getInvoke(scope: CdkStack, task: Task) {
    const lambda = getLambda(scope, task.app)

    return invoke(scope, task.description, {
        lambdaFunction: lambda,
        outputPath: "$.Payload",
    })
}   

function parseOrganisation(scope: CdkStack) {
    const parser = getInvoke(scope, BASE_ORGANISATION_PARSER)

    return map(scope, "Parse base organisations")
        .iterator(parser)
}

export function createCrawler(scope: CdkStack) {
    return run(scope, "GamesCrawler", {
        definition: parseOrganisation(scope)
    })
}
