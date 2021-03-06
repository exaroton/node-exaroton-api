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

#### Get account info
````js
let account = await client.getAccount();
console.log("My account is " + account.name + " and I have " + account.credits + " credits.");
````

The account object contains the fields and information as listed in the [documentation](https://support.exaroton.com/hc/en-us/articles/360011926177#account).

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

#### Get the server logs
```js
try {
    let logs = await server.getLogs();
    console.log(logs);
} catch (e) {
    console.error(e.message);
}
```
*This is cached and will not return the latest updates immediately. It's also not possible to get the server logs while the server is loading, stopping or saving.*

#### Share the server logs via mclo.gs
```js
try {
    let url = await server.shareLogs();
    console.log(url);
} catch (e) {
    console.error(e.message);
}
```
*This is cached and will not return the latest updates immediately. It's also not possible to share the server logs while the server is loading, stopping or saving.*

#### Get the server RAM
```js
try {
    let ram = await server.getRAM();
    console.log("This server has " + ram + " GB RAM.");
} catch (e) {
    console.error(e.message);
}
```
The amount of RAM is returned in full GiB.

#### Set the server RAM
```js
try {
    await server.setRAM(8);
} catch (e) {
    console.error(e.message);
}
```
The RAM is set in full GiB and has to be between 2 and 16.

#### Player lists
A player list is a list of players such as the whitelist, ops or bans.
Player list entries are usually usernames, but might be something else, e.g. IPs in the banned-ips list.
All player list operations are storage operations that might take a while, so try to reduce the amount of requests and combine actions when possible (e.g. adding/deleting multiple entries at once).
Player lists are also cached any might not immediately return new results when changed through other methods e.g. in-game.

##### Get a player list object
You can list all available player lists...
```js
try {
    let lists = await server.getPlayerLists();
    console.log(lists);
} catch (e) {
    console.error(e.message);
}
```

... or if you already now the name (e.g. "whitelist") you can directly create a player list object:
```js
try {
    let list = server.getPlayerList("whitelist");
    console.log(list);
} catch (e) {
    console.error(e.message);
}
```

##### Get all player list entries
```js
try {
    let list = server.getPlayerList("whitelist");
    let entries = await list.getEntries();
    console.log(entries);
} catch (e) {
    console.error(e.message);
}
```

##### Add player list entries
We handle all the heavy work of adding player list entries for you, e.g. automatically adding UUIDs depending on the online mode or executing the necessary commands while the server is running.
```js
try {
    let list = server.getPlayerList("whitelist");
    await list.addEntry("Steve"); // add just one entry
    await list.addEntries(["Steve", "Alex"]); // add multiple entries at once
    console.log(await list.getEntries());
} catch (e) {
    console.error(e.message);
}
```

##### Delete player list entries
```js
try {
    let list = server.getPlayerList("whitelist");
    await list.deleteEntry("Steve"); // delete just one entry
    await list.deleteEntries(["Steve", "Alex"]); // delete multiple entries at once
    console.log(await list.getEntries());
} catch (e) {
    console.error(e.message);
}
```