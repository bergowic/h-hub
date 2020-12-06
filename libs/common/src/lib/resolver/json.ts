import { Resolver } from "./resolver"

export class JsonResolver<T> implements Resolver<T> {
    private resolver: Resolver<string>

    constructor(resolver: Resolver<string>) {
        this.resolver = resolver
    }

    async resolve(): Promise<T> {
        const result = await this.resolver.resolve()
        const json = JSON.parse(result)

        return json as T
    }
}
