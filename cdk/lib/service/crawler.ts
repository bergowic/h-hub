import * as lambda from "@aws-cdk/aws-lambda";

import { CdkStack } from "../cdk-stack";
import { getLambdaFromApp } from "../infrastructure/lambda";

import { invoke, map, run } from "../infrastructure/stepfunction";

interface Task {
    app: string,
    description: string,
}

const ORGANISATION_PARSER = {
    app: "organisation-parser",
    description: "Parse base organisation",
}

const ORGANISATION_MERGER = {
    app: "organisation-merger",
    description: "Merge organisations",
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
    const parser = getInvoke(scope, ORGANISATION_PARSER)

    return map(scope, "Parse base organisations")
        .iterator(parser)
}

function mergeOrganisations(scope: CdkStack) {
    const merger = getInvoke(scope, ORGANISATION_MERGER)

    return merger
}

export function createCrawler(scope: CdkStack) {
    return run(scope, "GamesCrawler", {
        definition: parseOrganisation(scope)
            .next(mergeOrganisations(scope))
    })
}
