import { Association } from "@h-hub/models";
import { getAssociation } from "./app";

interface Props {
    id: string,
}

export const handler = async ({ id }: Props): Promise<Association> => {
    return await getAssociation(id)
}
