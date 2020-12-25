import { organisationToJson } from "@h-hub/common";
import { JsonOrganisation } from "@h-hub/models"
import { getOrganisation } from "./app";

interface Props {
    id: string,
}

export const handler = async ({ id }: Props): Promise<JsonOrganisation> => {
    const organisation = await getOrganisation(id)

    return organisationToJson(organisation)
}
