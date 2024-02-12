import WebSocket from "ws";
import { ConnectionOptions, ServerOptions, SessionOptions } from "./types";
import { Channel } from "./types";
import {PrivateChannel, PublicChannel} from "./channels";
import {Encrypt} from "./encrypt";

export class Instance {
    options: ConnectionOptions;

    server: ServerOptions;

    session: SessionOptions;

    socket: WebSocket;

    channels: Array<Channel> = [];

    reactor: Function = (message: Object) => {};
    close: Function = (message: Object) => {};

    constructor(options: ConnectionOptions, server: ServerOptions, session: SessionOptions, socket: WebSocket) {
        this.options = options;
        this.server = server;
        this.session = session;
        this.socket = socket;
    }

    get connected() {
        return this.socket.readyState == WebSocket.OPEN
    }

    async disconnect() {
        if (this.options.debug) {
            console.log("Instance::disconnect PENDING");
        }
        return new Promise<Instance>((resolve, reject) => {
            this.close = resolve;
            this.socket.close();
        });
    }

    on(reactor: Function) {
        this.reactor = reactor;
    }

    send(message: Object) {
        if (!this.connected) {
            throw new Error("Connection isn't open")
        }
        this.socket.send(JSON.stringify(message));
    }

    subscribe(name: string) {
        if (!this.connected) {
            throw new Error("Connection isn't open")
        }

        if (this.channels.some((item: Channel) => item.name === `name`)) {
            throw new Error("Channel is already subscribed");
        }

        const channel = new PublicChannel(name);
        this.channels.push(channel);

        if (this.options.debug) {
            console.log(`Instance::subscribe PENDING ID=${this.session.id} CHANNEL=${name}`);
        }

        return new Promise<PublicChannel>((resolve, reject) => {
            channel.resolve = resolve;
            channel.reject = reject;

            this.send({
                type: "subscribe",
                channel: name,
            })
        });
    }

    private(name: string, token: string = "") {
        if (!this.connected) {
            throw new Error("Connection isn't open")
        }

        if (this.options.secret) {
            token = Encrypt.make(this.options.secret, `${this.session.id}@private.${name}`)
        } else {
            if (token == "") {
                throw new Error("Token isn't assigned")
            }
        }

        if (this.channels.some((item: Channel) => item.name === `private.${name}`)) {
            throw new Error("Channel is already subscribed");
        }

        const channel = new PrivateChannel(`private.${name}`, token);
        this.channels.push(channel);

        if (this.options.debug) {
            console.log(`Instance::subscribe PENDING ID=${this.session.id} CHANNEL=private.${name}`);
        }

        return new Promise<PrivateChannel>((resolve, reject) => {
            channel.resolve = resolve;
            channel.reject = reject;

            this.send({
                type: "subscribe",
                channel: `private.${name}`,
                token: token,
            })
        });
    }

    /**
     * Factory
     * @param options
     * @param server
     */
    static async make(options: ConnectionOptions, server: ServerOptions) {
        return new Promise<Instance>((resolve, reject) => {
            try {
                const socket = new WebSocket(server.protocol + server.address, {
                    headers: {
                        Authorization: `Bearer ${options.authorization}`,
                    }
                })

                const session = {
                    id: ""
                } as SessionOptions;

                const instance = new Instance(options, server, session, socket)

                instance.socket.on("open", () => {
                    if (options.debug) {
                        console.log("Connection::connect OPEN")
                    }
                });

                instance.socket.on("message", (message: string) => {
                    const object = JSON.parse(message);
                    switch (object.type) {
                        case "accepted":
                            if (options.debug) {
                                console.log(`Connection::connect ACCEPTED ID=${object.data}`)
                            }
                            session.id = object.data;
                            resolve(instance);
                            break;
                        case "subscribed":
                            const index = instance.channels.findIndex((item: Channel) => item.name == object.channel);
                            const channel = instance.channels[index];
                            if (options.debug) {
                                console.log(`Instance::subscribe SUBSCRIBED ID=${session.id} CHANNEL=${object.channel}`)
                            }
                            channel.resolve(channel);
                            break;
                        case "event":
                            if (object.channel == "*") {
                                instance.reactor(object);
                            } else {
                                const index = instance.channels.findIndex((item: Channel) => item.name == object.channel);
                                const channel = instance.channels[index];
                                if (options.debug) {
                                    console.log(`Channel::${object.channel} RECEIVED ID=${session.id} DATA=${message.toString()}`)
                                }
                                channel.reactor(object);
                            }
                            break;
                        default:
                            break;
                    }
                })

                instance.socket.on("close", () => {
                    if (options.debug) {
                        console.log("Instance::disconnect OK");
                    }
                    instance.close();
                })
            } catch (e: any) {
                reject()
            }
        });
    }
}