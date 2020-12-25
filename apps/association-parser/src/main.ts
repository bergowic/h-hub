import { associationToJson } from "@h-hub/common"
import { JsonAssociation } from "@h-hub/models"
import { getAssociation } from "./app";

interface Props {
    id: string,
}

export const handler = async ({ id }: Props): Promise<JsonAssociation> => {
    const association = await getAssociation(id)

    return associationToJson(association)
}
