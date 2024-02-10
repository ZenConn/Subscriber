import { Connection } from "./core/connection";
import 'dotenv/config'

(async () => {
    const connection = new Connection({
        authorization: process.env.TOKEN as string,
        address: process.env.ADDRESS as string,
        port: Number.parseInt(process.env.PORT as string),
        secure: process.env.SECURE as string == "true",
        debug: process.env.DEBUG as string == "true"
    });
    const instance = await connection.connect();
    instance.on((message: Object) => {
        console.log("Realm:", message);
    });
    const notifications = await instance.subscribe("notifications");
    notifications.on((message: Object) => {
        console.log("Data:", message);
    })
    // instance.disconnect();
})()