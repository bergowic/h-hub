import { RawOrganisationResolver, transformRawOrganisation, RawOrgProps } from "@h-hub/common"
import { Organisation, RawOrganisation } from "@h-hub/models"

export interface OrgParserProps extends RawOrgProps {
    subOrgIds?: string[],
}

async function getRawOrganisation(props: RawOrgProps): Promise<RawOrganisation> {
    const resolver = new RawOrganisationResolver<RawOrganisation>(props)

    return await resolver.resolve()
}

export async function getOrganisation(props: OrgParserProps): Promise<Organisation> {
    const rawOrganisation = await getRawOrganisation(props)
    const organisation = transformRawOrganisation(rawOrganisation)

    return {
        ...organisation,
        orgId: props.orgId,
        subOrgIds: props.subOrgIds ? new Set(props.subOrgIds) : organisation.subOrgIds,
    }
}
