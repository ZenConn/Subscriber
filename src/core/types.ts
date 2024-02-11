
export interface ConnectionOptions {
    authorization: string | undefined,
    address: string | undefined
    port: number | undefined
    secure: boolean | undefined
    debug: boolean | undefined
    secret?: string | undefined
}

export interface ServerOptions {
    protocol: string
    address: string
}

export interface SessionOptions {
    id: string
}

export interface Channel {
    name: string
    token?: string
    reactor: Function
    resolve: Function
    reject: Function
    on(reactor: Function): void
}