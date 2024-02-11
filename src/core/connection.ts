import { Instance } from "./instance";
import { ConnectionOptions, ServerOptions } from "./types";

export class Connection {
    options: ConnectionOptions;
    server: ServerOptions;

    constructor(options: ConnectionOptions) {
        this.options = options;
        this.server = {
            protocol: this.options.secure ? `wss://` : `ws://`,
            address: this.options.address + ":" + this.options.port,
        }
        if (this.options.debug) {
            console.log("Connection::constructor OK")
        }
    }

    async connect() {
        if (!this.options.authorization) {
            throw new Error("Attribute authorization in options is required.")
        }

        if (!this.options.address) {
            throw new Error("Attribute address in options is required")
        }

        if (!this.options.port) {
            throw new Error("Attribute port in options is required")
        }

        if (!this.options.secure) {
            throw new Error("Attribute secure in options is required")
        }

        if (this.options.debug) {
            console.log("Connection::connect PENDING")
        }

        return await Instance.make(this.options, this.server); // Promise<Instance>
    }
}
