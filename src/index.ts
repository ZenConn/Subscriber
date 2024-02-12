import { Connection } from "./core/connection";
import 'dotenv/config'

(async () => {
    const connection = new Connection({
        authorization: process.env.ADMIN_TOKEN as string,
        address: process.env.ADDRESS as string,
        port: Number.parseInt(process.env.PORT as string),
        secure: process.env.SECURE as string == "true",
        debug: process.env.DEBUG as string == "true",
        secret: process.env.SECRET as string,
        // authorize: async (signature: string) => { // "<uuid>@<channel>
        //     const response = await axios.post("https://server.com/authorize", {
        //         data: signature
        //     })
        //     return response.data(); // "a1b2c3"
        // }
    });

    const instance = await connection.connect();

    instance.on((message: Object) => {
        console.log("Realm:", message);
    });

    const notifications = await instance.subscribe("notifications");
    notifications.on((message: Object) => {
        console.log("Datum:", message);
    })

    const invoices = await instance.private("invoices");
    const invoices2 = await instance.private("invoices");
    // invoices.on((message: Object) => {
    //     console.log("Data:", message);
    // })
    // instance.disconnect();
})()