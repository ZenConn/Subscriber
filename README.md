## JavaScript SDK for WebSockets

[![codecov](https://codecov.io/gh/ZenPub/SDK-JS/graph/badge.svg?token=93RO9F0OE2)](https://codecov.io/gh/ZenPub/SDK-JS)

### Connection

```js
import { Connection } from "wsocket";

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
    const channel = instance.subscribe("notifications");
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
    const channel = instance.private("notifications", "authorization_token");
    channel.on((message: string) => {
        console.log(message);
    })  
} catch (e: any) {
    console.log("Unauthorized");   
}
```
