## JavaScript SDK for WebSockets

[![codecov](https://codecov.io/gh/ZenPub/SDK-JS/graph/badge.svg?token=93RO9F0OE2)](https://codecov.io/gh/ZenPub/SDK-JS)

### Connection

```js
import { Connection } from "@zenpub/javascript";

const connection = new Connection({
        authorization: "TOKEN",
        address: "HOST",
        port: 1000,
        secure: true, // SSL
        debug: false, // Skip logging
        secret: "SECRET", // For server applications
});

const instance = await connection.connect();
```

### Subscription

#### Public Channels

```js
try {
    const channel = await instance.subscribe("notifications");
    channel.on((message: string) => {
        console.log(message);
    })  
} catch (e: any) {
    console.log("Unauthorized");   
}
```

#### Private Channels

```js
try {
    const channel = await instance.private("notifications");
    channel.on((message: string) => {
        console.log(message);
    })  
} catch (e: any) {
    console.log("Unauthorized");   
}
```

#### Authorization

If `secret` isn't passed as option then:

```js
const channel = "notifications";
const input = `${instance.session.id}@private.${channel}`;
const secret = "secret";
const hash = Encrypt.make(secret, input);
const channel = await instance.private(channel, hash);
```