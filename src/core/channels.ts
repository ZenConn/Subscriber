export class Channel {
    name: string
    token?: string
    reactor: Function = (message: Object) => {};
    resolve: Function = (channel: Channel) => {}
    reject: Function = () => {}
    constructor(name: string, token: string = "") {
        this.name = name;
        this.token = token;
    }
    on(reactor: Function) {
        this.reactor = reactor;
    }
}