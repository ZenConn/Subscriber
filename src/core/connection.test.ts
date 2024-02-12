import { Connection } from "./connection";
import 'dotenv/config'

it('[Administrator] Connection::constructor should assign the options', async () => {
    const connection = new Connection({
        authorization: process.env.ADMIN_TOKEN as string,
        address: process.env.ADDRESS as string,
        port: Number.parseInt(process.env.PORT as string),
        secure: true,
        debug: true,
        secret: process.env.SECRET as string,
    });

    expect(connection.options.authorization).toBe(process.env.ADMIN_TOKEN)
    expect(connection.options.address).toBe(process.env.ADDRESS)
    expect(connection.options.port).toBe(Number.parseInt(process.env.PORT as string))
    expect(connection.options.secure).toBe(true)
    expect(connection.options.debug).toBe(true)
    expect(connection.options.secret).toBe(process.env.SECRET)

    const instance = await connection.connect()
    await instance.disconnect();
});

it('[User] Connection::constructor should assign the options', async () => {
    const connection = new Connection({
        authorization: process.env.CLIENT_TOKEN as string,
        address: process.env.ADDRESS as string,
        port: Number.parseInt(process.env.PORT as string),
        secure: true,
        debug: true,
        secret: process.env.SECRET as string,
    });

    expect(connection.options.authorization).toBe(process.env.CLIENT_TOKEN)

    const instance = await connection.connect()
    await instance.disconnect();
});

it("[SDK] Connection::constructor doesn't includes all the options", async () => {
    try {
        const connection = new Connection({
            authorization: undefined,
            address: undefined,
            port: undefined,
            secure: undefined,
            debug: undefined,
        });

        await connection.connect();
    } catch (e:any) {
        expect(e.message).toBe("Attribute authorization in options is required.")
    }

    try {
        const connection = new Connection({
            authorization: "abc",
            address: undefined,
            port: undefined,
            secure: undefined,
            debug: undefined,
        });

        await connection.connect();
    } catch (e:any) {
        expect(e.message).toBe("Attribute address in options is required")
    }

    try {
        const connection = new Connection({
            authorization: "abc",
            address: "abc",
            port: undefined,
            secure: undefined,
            debug: undefined,
        });

        await connection.connect();
    } catch (e:any) {
        expect(e.message).toBe("Attribute port in options is required")
    }

    try {
        const connection = new Connection({
            authorization: "abc",
            address: "abc",
            port: 20000,
            secure: undefined,
            debug: undefined,
        });

        await connection.connect();
    } catch (e:any) {
        expect(e.message).toBe("Attribute secure in options is required")
    }
});