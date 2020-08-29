# Node.js exaroton API client

### About
The exaroton API allows automated access to some basic functionalities of your game servers, such as starting or stopping 
the server. You can read the API documentation here: https://support.exaroton.com/hc/en-us/articles/360011926177

This is the official Node.js implementation of this API.

### Installation

```
npm install exaroton
```

### Usage
To use the API and this client you have to get your API key, which you can generate in your exaroton account settings: https://exaroton.com/account

#### Create a client object
```js
const {Client} = require('exaroton');

const client = new Client(token);
```
*Remember to keep your token secret and don't add it to any private or public code repositories.*

#### List servers
```js
let servers = await client.getServers();

for(let server of servers) {
    console.log(server.name + ": " + server.id);
}
```

Each server object contains the fields and information as listed in the [documentation](https://support.exaroton.com/hc/en-us/articles/360011926177#servers).

#### Create a server object by ID
```js
let server = client.server(id);
```

#### Get server information
```js
await server.get();
console.log(server.name + ": " + server.id);
```

#### Get/check the server status
```js
console.log(server.status);

if (server.hasStatus(server.STATUS.ONLINE)) {
    console.log("Server is online.");
} else if (server.hasStatus([server.STATUS.PREPARING, server.STATUS.LOADING, server.STATUS.STARTING])) {
    console.log("Server is online soon.");
} else {
    console.log("Server is offline.");
}
```
The server status is an `integer` as described in the [documentation](https://support.exaroton.com/hc/en-us/articles/360011926177#servers). You can use
the [ServerStatus](./src/Server/ServerStatus.js) object, which you can require on its own `const {ServerStatus} = require('exaroton')` or via the
shorthand `server.STATUS` property.

#### Start/stop/restart the server
```js
try {
    await server.start();
    await server.stop();
    await server.restart();
} catch (e) {
    console.error(e.message);
}
```
*It's important to catch errors, because incorrect calls, e.g. a `server.stop()` when the server is offline will result in an error.*

#### Execute a server command
```js
try {
    await server.executeCommand("say Hello world!");
} catch (e) {
    console.error(e.message);
}
```