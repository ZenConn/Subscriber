import { Broadcast, Channel } from "./types";
import { Instance } from "./instance";

export class PublicChannel implements Channel {
    name: string
    instance: Instance
    token?: string
    reactor: Function = (message: Object) => {};
    resolve: Function = (channel: Channel) => {}
    reject: Function = () => {}
    constructor(name: string, instance: Instance) {
        this.name = name;
        this.instance = instance;
    }
    on(reactor: Function) {
        this.reactor = reactor;
    }
    broadcast(data: Object): Promise<Object> {
        return new Promise<Object>((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
            this.instance.send({
                type: "broadcast",
                channel: this.name,
                data: data,
            } as Broadcast);
        });
    }
}

export class PrivateChannel implements Channel {
    name: string
    token: string
    instance: Instance
    reactor: Function = (message: Object) => {};
    resolve: Function = (channel: Channel) => {}
    reject: Function = () => {}
    constructor(name: string, token: string, instance: Instance) {
        this.name = name;
        this.token = token;
        this.instance = instance;
    }
    on(reactor: Function) {
        this.reactor = reactor;
    }
    broadcast(data: Object): Promise<Object> {
        return new Promise<Object>((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
            this.instance.send({
                type: "broadcast",
                channel: this.name,
                data: data,
            } as Broadcast);
        });
    }
}