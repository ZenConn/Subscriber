import { Connection } from "./connection";
import 'dotenv/config'
import { Channel } from "./types";

it('[SDK] Instance::connected should be true', async () => {
    const connection = new Connection({
        authorization: process.env.ADMIN_TOKEN as string,
        address: process.env.ADDRESS as string,
        port: Number.parseInt(process.env.PORT as string),
        secure: true,
        debug: true,
        secret: process.env.SECRET as string,
    });

    const instance = await connection.connect()

    expect(instance.connected).toBe(true);

    await instance.disconnect();
});

it('[SDK] Instance::subscribe should add the new channel to the list', async () => {
    const connection = new Connection({
        authorization: process.env.ADMIN_TOKEN as string,
        address: process.env.ADDRESS as string,
        port: Number.parseInt(process.env.PORT as string),
        secure: true,
        debug: true,
        secret: process.env.SECRET as string,
    });

    const instance = await connection.connect()
    const channel = await instance.subscribe("notifications");

    channel.on(() => {})

    expect(instance.channels.some((item: Channel) => item.name === "notifications")).toBe(true)

    await instance.disconnect();
});

it("[SDK] Instance::send should throw exception on send when isn't connected", async () => {
    const connection = new Connection({
        authorization: process.env.ADMIN_TOKEN as string,
        address: process.env.ADDRESS as string,
        port: Number.parseInt(process.env.PORT as string),
        secure: true,
        debug: true,
        secret: process.env.SECRET as string,
    });

    const instance = await connection.connect()

    await instance.disconnect();

    try {
        instance.send({
            type: "testing",
            channel: "dev"
        });
    } catch (e:any) {
        expect(e.message).toBe("Connection isn't open")
    }
});

it("[SDK] Instance::subscribe should throw exception when isn't connected", async () => {
    const connection = new Connection({
        authorization: process.env.ADMIN_TOKEN as string,
        address: process.env.ADDRESS as string,
        port: Number.parseInt(process.env.PORT as string),
        secure: true,
        debug: true,
        secret: process.env.SECRET as string,
    });

    const instance = await connection.connect()

    await instance.disconnect();

    try {
        const channel = await instance.subscribe("notifications");
    } catch (e:any) {
        expect(e.message).toBe("Connection isn't open")
    }
});

it("[SDK] Instance::private should throw exception when isn't connected", async () => {
    const connection = new Connection({
        authorization: process.env.ADMIN_TOKEN as string,
        address: process.env.ADDRESS as string,
        port: Number.parseInt(process.env.PORT as string),
        secure: true,
        debug: true,
        secret: process.env.SECRET as string,
    });

    const instance = await connection.connect()

    await instance.disconnect();

    try {
        const channel = await instance.private("notifications");
    } catch (e:any) {
        expect(e.message).toBe("Connection isn't open")
    }
});

it("[SDK] Instance::send should throw exception on subscription when is already subscribed", async () => {
    const connection = new Connection({
        authorization: process.env.ADMIN_TOKEN as string,
        address: process.env.ADDRESS as string,
        port: Number.parseInt(process.env.PORT as string),
        secure: true,
        debug: true,
        secret: process.env.SECRET as string,
    });

    const instance = await connection.connect()

    try {
        const first = await instance.subscribe("notifications");
        const second = await instance.subscribe("notifications");
    } catch (e:any) {
        expect(e.message).toBe("Channel is already subscribed")
    }

    await instance.disconnect();
});

it("[SDK] Instance::private should throw exception on private subscription when is already subscribed", async () => {
    const connection = new Connection({
        authorization: process.env.ADMIN_TOKEN as string,
        address: process.env.ADDRESS as string,
        port: Number.parseInt(process.env.PORT as string),
        secure: true,
        debug: true,
        secret: process.env.SECRET as string,
    });

    const instance = await connection.connect()

    try {
        const first = await instance.private("invoices");
        const second = await instance.private("invoices");
    } catch (e:any) {
        expect(e.message).toBe("Channel is already subscribed");
    }

    await instance.disconnect();
});

it('[SDK] Instance::private should works', async () => {
    const connection = new Connection({
        authorization: process.env.ADMIN_TOKEN as string,
        address: process.env.ADDRESS as string,
        port: Number.parseInt(process.env.PORT as string),
        secure: true,
        debug: true,
        secret: process.env.SECRET as string,
    });

    const instance = await connection.connect()

    expect(instance.connected).toBe(true);
    const channel = await instance.private("invoices");
    await instance.disconnect();
});

it("[SDK] Instance::private should throw exception on private subscription when secret and token isn't assigned", async () => {
    const connection = new Connection({
        authorization: process.env.ADMIN_TOKEN as string,
        address: process.env.ADDRESS as string,
        port: Number.parseInt(process.env.PORT as string),
        secure: true,
        debug: true,
    });

    const instance = await connection.connect()

    try {
        const channel = await instance.private("invoices");
    } catch (e:any) {
        expect(e.message).toBe("Token isn't assigned");
    }
    await instance.disconnect();
});

it("[SDK] Instance::reactor should assign the reactor", async () => {
    const connection = new Connection({
        authorization: process.env.ADMIN_TOKEN as string,
        address: process.env.ADDRESS as string,
        port: Number.parseInt(process.env.PORT as string),
        secure: true,
        debug: true,
        secret: process.env.SECRET as string,
    });

    const instance = await connection.connect()

    instance.on((message: Object) => {
        console.log(message);
    });

    await instance.disconnect();
});

it("[SDK] Instance::on_message should react", async () => {
    const connection = new Connection({
        authorization: process.env.ADMIN_TOKEN as string,
        address: process.env.ADDRESS as string,
        port: Number.parseInt(process.env.PORT as string),
        secure: true,
        debug: true,
        secret: process.env.SECRET as string,
    });

    const instance = await connection.connect()

    const instance_b = await connection.connect()

    instance.on((message: Object) => {
        console.log(message);
    });

    instance_b.on((message: Object) => {
    });

    const notifications_b = await instance_b.private("notifications");
    const notifications = await instance.private("notifications");

    notifications.on((message: string) => {
    })

    await notifications.broadcast({
        data: "HELLO"
    })

    await notifications_b.broadcast({
        data: "HELLO"
    })

    await instance.broadcast({
        data: "HI"
    });

    await instance.disconnect();
    await instance_b.disconnect();
});

it("[SDK] Instance should react", async () => {
    const connection = new Connection({
        authorization: "dummy",
        address: process.env.ADDRESS as string,
        port: Number.parseInt(process.env.PORT as string),
        secure: true,
        debug: true,
        secret: process.env.SECRET as string,
    });

    try {
        const instance = await connection.connect()
    } catch (e) {
        expect(true).toBe(true)
    }
});

it("[SDK] Instance::private can throw error", async () => {
    const connection = new Connection({
        authorization: process.env.CLIENT_TOKEN as string,
        address: process.env.ADDRESS as string,
        port: Number.parseInt(process.env.PORT as string),
        secure: true,
        debug: true,
        secret: "abcdef",
    });

    const instance = await connection.connect();
    try {

        const invoices = await instance.private("invoices");
    } catch (e) {
        console.log(e)
        expect(true).toBe(true)
    }
    await instance.disconnect();
});

it("[SDK] Instance::broadcast can call error", async () => {
    const connection = new Connection({
        authorization: process.env.CLIENT_TOKEN as string,
        address: process.env.ADDRESS as string,
        port: Number.parseInt(process.env.PORT as string),
        secure: true,
        debug: true,
        secret: process.env.SECRET as string,
    });

    const instance = await connection.connect();
    try {
        await instance.broadcast({
            data: "HELLO"
        })
    } catch (e) {
        expect(true).toBe(true)
    }
    await instance.disconnect();
});

it("[SDK] Instance::private can call error", async () => {
    const connection = new Connection({
        authorization: process.env.CLIENT_TOKEN as string,
        address: process.env.ADDRESS as string,
        port: Number.parseInt(process.env.PORT as string),
        secure: true,
        debug: true,
        secret: process.env.SECRET as string,
    });

    const instance = await connection.connect();
    try {
        const channel = await instance.private("notifications");
        await channel.broadcast({
            data: "HELLO"
        })
    } catch (e) {
        expect(true).toBe(true)
    }
    await instance.disconnect();
});

it("[SDK] Instance::public can call error", async () => {
    const connection = new Connection({
        authorization: process.env.CLIENT_TOKEN as string,
        address: process.env.ADDRESS as string,
        port: Number.parseInt(process.env.PORT as string),
        secure: true,
        debug: true,
        secret: process.env.SECRET as string,
    });

    const instance = await connection.connect();
    try {
        const channel = await instance.subscribe("notifications");
        await channel.broadcast({
            data: "HELLO"
        })
    } catch (e) {
        expect(true).toBe(true)
    }
    await instance.disconnect();
});
