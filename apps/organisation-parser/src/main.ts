import { organisationToJson, RawOrgProps } from "@h-hub/common";
import { JsonOrganisation } from "@h-hub/models"
import { getOrganisation } from "./app";

export const handler = async (props: RawOrgProps): Promise<JsonOrganisation> => {
    const organisation = await getOrganisation(props)

    return organisationToJson(organisation)
}
