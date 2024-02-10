
export interface ConnectionOptions {
    authorization: string | undefined,
    address: string | undefined
    port: number | undefined
    secure: boolean | undefined
    debug: boolean | undefined
}

export interface ServerOptions {
    protocol: string
    address: string
}

export interface SessionOptions {
    id: string
}