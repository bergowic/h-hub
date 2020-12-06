import { RawOrganisation } from "@h-hub/models";
import { ORGANISATION_URL_PATTERN } from "@h-hub/environment";
import { JsonResolver } from "./json";
import { Resolver } from "./resolver";
import { WebsiteResolver } from "./website";
import * as util from "util";

export class RawOrganisationResolver<T extends RawOrganisation> implements Resolver<T> {
    private id: string

    constructor(id: string) {
        this.id = id
    }

    private getUrl(): string {
        return util.format(ORGANISATION_URL_PATTERN, this.id, this.id)
    }

    async resolve(): Promise<T> {
        const websiteResolver = new WebsiteResolver(this.getUrl())
        const jsonResolver = new JsonResolver<T[]>(websiteResolver)
        const organisations = await jsonResolver.resolve()
        
        // will return an array with one entry
        return organisations[0]
    }
}
