import { RawOrganisationResolver, transformRawOrganisation } from "@h-hub/common"
import { Organisation, RawOrganisation } from "@h-hub/models"

async function getRawOrganisation(id: string): Promise<RawOrganisation> {
    const resolver = new RawOrganisationResolver<RawOrganisation>(id)

    return await resolver.resolve()
}

export async function getOrganisation(id: string): Promise<Organisation> {
    const rawOrganisation = await getRawOrganisation(id)

    return transformRawOrganisation(rawOrganisation)
}
