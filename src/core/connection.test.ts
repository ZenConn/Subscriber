import {Connection} from "./connection";

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
    instance.disconnect();
});

it('[User] Connection::constructor should assign the options', async () => {
    const connection = new Connection({
        authorization: process.env.USER_TOKEN as string,
        address: process.env.ADDRESS as string,
        port: Number.parseInt(process.env.PORT as string),
        secure: true,
        debug: true,
        secret: process.env.SECRET as string,
    });

    expect(connection.options.authorization).toBe(process.env.USER_TOKEN)

    const instance = await connection.connect()
    instance.disconnect();
});