import { Channel} from "./types";

export class PublicChannel implements Channel {
    name: string
    token?: string
    reactor: Function = (message: Object) => {};
    resolve: Function = (channel: Channel) => {}
    reject: Function = () => {}
    constructor(name: string) {
        this.name = name;
    }
    on(reactor: Function) {
        this.reactor = reactor;
    }
}

export class PrivateChannel implements Channel {
    name: string
    token: string
    reactor: Function = (message: Object) => {};
    resolve: Function = (channel: Channel) => {}
    reject: Function = () => {}
    constructor(name: string, token: string) {
        this.name = name;
        this.token = token;
    }
    on(reactor: Function) {
        this.reactor = reactor;
    }
}