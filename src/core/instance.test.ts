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
        instance.send({});
    } catch (e:any) {
        expect(e.message).toBe("Connection isn't open")
    }
});

it("[SDK] Instance::send should throw exception on subscription when isn't connected", async () => {
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

// it("[SDK] Instance::private should throw exception on private subscription when is already subscribed", async () => {
//     const connection = new Connection({
//         authorization: process.env.ADMIN_TOKEN as string,
//         address: process.env.ADDRESS as string,
//         port: Number.parseInt(process.env.PORT as string),
//         secure: true,
//         debug: true,
//         secret: process.env.SECRET as string,
//     });
//
//     const instance = await connection.connect()
//
//     try {
//         const first = await instance.private("invoices");
//         const second = await instance.private("invoices");
//     } catch (e:any) {
//         expect(e.message).toBe("Channel is already subscribed");
//         expect(true).toBe(false)
//     }
//
//     await instance.disconnect();
// }, 50000);
//
// it("[SDK] Instance::send should throw exception on subscription when is already subscribed", async () => {
//     const connection = new Connection({
//         authorization: process.env.ADMIN_TOKEN as string,
//         address: process.env.ADDRESS as string,
//         port: Number.parseInt(process.env.PORT as string),
//         secure: true,
//         debug: true,
//         secret: process.env.SECRET as string,
//     });
//
//     const instance = await connection.connect()
//
//     try {
//         const first = await instance.subscribe("notifications");
//         const second = await instance.subscribe("notifications");
//     } catch (e:any) {
//         expect(e.message).toBe("Channel is already subscribed")
//     }
//
//     instance.socket.close();
//     // await instance.disconnect();
// });

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
