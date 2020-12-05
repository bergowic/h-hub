import { RawAssociation, RawOrganisation } from '@h-hub/models'

export interface Resolver<T> {
    resolve(): Promise<T>
}

export class WebsiteRawAssociationResolver implements Resolver<RawAssociation> {
    async resolve(): Promise<RawAssociation> {
        throw new Error('not implemented')
    }
}

export class WebsiteRawOrganisationResolver implements Resolver<RawOrganisation> {
    async resolve(): Promise<RawOrganisation> {
        throw new Error('not implemented')
    }
}