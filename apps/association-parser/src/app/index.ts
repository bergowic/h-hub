import { RawOrganisationResolver, transformRawAssociation } from "@h-hub/common"
import { Association, RawAssociation } from "@h-hub/models"

async function getRawAssociation(id: string): Promise<RawAssociation> {
    const resolver = new RawOrganisationResolver<RawAssociation>(id)

    return await resolver.resolve()
}

export async function getAssociation(id: string): Promise<Association> {
    const rawAssociation = await getRawAssociation(id)

    return transformRawAssociation(rawAssociation)
}
