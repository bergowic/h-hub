export interface Resolver<T> {
    resolve(): Promise<T>
}
