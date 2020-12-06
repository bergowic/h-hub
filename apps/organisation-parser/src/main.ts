import { Organisation } from "@h-hub/models";
import { getOrganisation } from "./app";

interface Props {
    id: string,
}

export const handler = async ({ id }: Props): Promise<Organisation> => {
    return await getOrganisation(id)
}
