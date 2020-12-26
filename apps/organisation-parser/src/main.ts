import { organisationToJson } from "@h-hub/common";
import { JsonOrganisation } from "@h-hub/models"
import { getOrganisation, OrgParserProps } from "./app";

export const handler = async (props: OrgParserProps): Promise<JsonOrganisation> => {
    const organisation = await getOrganisation(props)

    return organisationToJson(organisation)
}
