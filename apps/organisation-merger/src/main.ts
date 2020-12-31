import { jsonToOrganisation, organisationToJson, RawOrgProps } from "@h-hub/common";
import { JsonOrganisation } from "@h-hub/models";

import { getParentOrgs, getBaseOrganisations, getSubOrgs } from "./app";

interface Result {
    subOrgs: RawOrgProps[],
    baseOrganisations: JsonOrganisation[],
    parentOrgs: RawOrgProps[],
}

export const handler = async (props: JsonOrganisation[]): Promise<Result> => {
    const orgs = props.map(jsonToOrganisation)

    const subOrgs = getSubOrgs(orgs)
    const baseOrganisations = getBaseOrganisations(orgs)
    const parentOrgs = getParentOrgs(orgs)

    return {
        subOrgs: subOrgs,
        baseOrganisations: baseOrganisations.map(organisationToJson),
        parentOrgs: parentOrgs,
    }
}
