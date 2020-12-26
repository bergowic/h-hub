import { CdkStack } from "../cdk-stack";
import { getLambdaFromApp } from "../infrastructure/lambda";

import { invoke, run, map } from "../infrastructure/stepfunction";

interface Task {
    app: string,
    description: string,
}

const ASSOCIATION_PARSER = {
    app: "association-parser",
    description: "Parse association",
}

const ORGANISATION_PARSER = {
    app: "organisation-parser",
    description: "Parse organisation",
}

function getInvoke(scope: CdkStack, task: Task) {
    const lambda = getLambdaFromApp(scope, task.app)

    return invoke(scope, task.description, {
        lambdaFunction: lambda,
        outputPath: "$.Payload",
    })
} 

function parseAssociation(scope: CdkStack) {
    return getInvoke(scope, ASSOCIATION_PARSER)
}

function parseOrganisation(scope: CdkStack) {
    return map(scope, "Parse organisations", {
        itemsPath: "$.subOrganisationIds",
        parameters: {
            "id.$": "$$.Map.Item.Value",
        },
    }).iterator(getInvoke(scope, ORGANISATION_PARSER))
}

export function createCrawler(scope: CdkStack) {
    return run(scope, "GamesCrawler", {
        definition: parseAssociation(scope)
            .next(parseOrganisation(scope))
    })
}
