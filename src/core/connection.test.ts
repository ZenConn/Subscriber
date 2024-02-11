import {Connection} from "./connection";

it('Connection::constructor should assign the options', () => {
    const connection = new Connection({
        authorization: process.env.TOKEN as string,
        address: process.env.ADDRESS as string,
        port: Number.parseInt(process.env.PORT as string),
        secure: true,
        debug: true,
        secret: process.env.SECRET as string,
    });

    expect(connection.options.authorization).toBe(process.env.authorization)
    expect(connection.options.address).toBe(process.env.ADDRESS)
    expect(connection.options.port).toBe(Number.parseInt(process.env.PORT as string))
    expect(connection.options.secure).toBe(true)
    expect(connection.options.debug).toBe(true)
    expect(connection.options.secret).toBe(process.env.SECRET)
});