import got from "got";
import { Resolver } from "./resolver";

export class WebsiteResolver implements Resolver<string> {
    private url: string

    constructor(url: string) {
        this.url = url
    }

    async resolve(): Promise<string> {
        const response = await got(this.url)

        return response.body
    }
}
