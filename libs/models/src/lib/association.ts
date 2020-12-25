import { JsonOrganisation, Organisation } from './organisation';

export interface Association extends Organisation {
    subOrganisationIds: Set<string>,
}

export interface JsonAssociation extends JsonOrganisation {
    subOrganisationIds: string[],
}
