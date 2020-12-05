import { Organisation } from './organisation';

export interface Association extends Organisation {
    subOrganisationIds: Set<string>,
}
