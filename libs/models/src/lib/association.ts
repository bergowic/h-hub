import { Organisation } from './organisation';

export interface Association extends Organisation {
    subOrganisationiIds: Set<string>,
}
