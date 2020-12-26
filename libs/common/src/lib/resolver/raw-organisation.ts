import { ORGANISATION_URL_PATTERN } from "@h-hub/environment";
import { JsonResolver } from "./json";
import { Resolver } from "./resolver";
import { WebsiteResolver } from "./website";
import * as util from "util";

export interface RawOrgProps {
    id: string,
    orgId?: string,
}

export class RawOrganisationResolver<RawOrganisation> implements Resolver<RawOrganisation> {
    private props: RawOrgProps

    constructor(props: RawOrgProps) {
        this.props = props
    }

    private getOrgId(): string {
        if (this.props.orgId) {
            return this.props.orgId
        }
        return this.props.id
    }

    private getUrl(): string {
        return util.format(ORGANISATION_URL_PATTERN, this.props.id, this.getOrgId())
    }

    async resolve(): Promise<RawOrganisation> {
        const websiteResolver = new WebsiteResolver(this.getUrl())
        const jsonResolver = new JsonResolver<RawOrganisation[]>(websiteResolver)
        const organisations = await jsonResolver.resolve()

        // will return an array with one entry
        return organisations[0]
    }
}
