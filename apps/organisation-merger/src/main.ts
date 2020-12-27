import { jsonToOrganisation, organisationToJson, RawOrgProps } from "@h-hub/common";
import { JsonOrganisation } from "@h-hub/models";

import { getParentOrganisations, getBaseOrganisations, getSubOrganisations } from "./app";

interface Result {
    subOrgs: RawOrgProps[],
    baseOrganisations: JsonOrganisation[],
    parentOrgs: RawOrgProps[],
}

export const handler = async (props: JsonOrganisation[]): Promise<Result> => {
    const orgs = props.map(jsonToOrganisation)

    const subOrganisations = getSubOrganisations(orgs)
    const baseOrganisations = getBaseOrganisations(orgs)
    const parentOrganisations = getParentOrganisations(orgs)

    return {
        subOrgs: subOrganisations,
        baseOrganisations: baseOrganisations.map(organisationToJson),
        parentOrgs: parentOrganisations,
    }
}
