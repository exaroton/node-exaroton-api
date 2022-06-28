# Node.js exaroton API client

## About
The exaroton API allows automated access to some basic functionalities of your game servers, such as starting or stopping 
the server. You can read the API documentation here: https://developers.exaroton.com

This is the official Node.js implementation of this API.

### Installation

```
npm install exaroton
```

## Usage
To use the API and this client you have to get your API key, which you can generate in your exaroton account settings: https://exaroton.com/account


### Create a client object
```js
const {Client} = require('exaroton');

const client = new Client(token);
```
*Remember to keep your token secret and don't add it to any private or public code repositories.*

### REST API

#### Get account info
````js
let account = await client.getAccount();
console.log("My account is " + account.name + " and I have " + account.credits + " credits.");
````

The account object contains the fields and information as listed in the [documentation](https://developers.exaroton.com/#account-get).

#### List servers
```js
let servers = await client.getServers();

for(let server of servers) {
    console.log(server.name + ": " + server.id);
}
```

Each server object contains the fields and information as listed in the [documentation](https://developers.exaroton.com/#servers-get).

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
The server status is an `integer` as described in the [documentation](https://developers.exaroton.com/#header-server-status). You can use
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

#### Get the server MOTD
```js
try {
    let motd = await server.getMOTD();
    console.log(motd);
} catch (e) {
    console.error(e.message);
}
```

#### Set the server MOTD
```js
try {
    await server.setMOTD("Hello world!");
} catch (e) {
    console.error(e.message);
}
```

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

... or if you already know the name (e.g. "whitelist") you can directly create a player list object:
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

#### Files

You can request information about files, download and upload files.

##### Get a file object
This just creates the file object but doesn't request any information or content
```js
let file = server.getFile("server.properties");
```

##### Get file information
If a file doesn't exist you will get a 404 error.
```js
try {
    await file.getInfo();
    console.log(file);
} catch (e) {
    console.error(e.message);
}
```

##### Get the content of a file / download a file
```js
try {
    // get the content of the file in a variable
    // large files will cause high memory usage
    let content = await file.getContent();
    console.log(content);
    
    // or download the file to a local file
    await file.download("test.txt");
    
    // or download the file to a stream
    let stream = await file.downloadToStream(createWriteStream("test.txt"));
} catch (e) {
    console.error(e.message);
}
```

##### Change the content of a file / upload a file
```js
try {
    // change the content of the file
    await file.setContent("Hello world!");
    
    // or upload a local file
    await file.upload("test.txt");
    
    // or upload from a stream
    await file.uploadFromStream(createReadStream("test.txt"));
} catch (e) {
    console.error(e.message);
}
```

##### Delete a file
```js
try {
    await file.delete();
} catch (e) {
    console.error(e.message);
}
```

##### Create a directory
```js
try {
    await file.createAsDirectory();
} catch (e) {
    console.error(e.message);
}
```

### Websocket API
The websocket API allows a constant connection to our websocket service to receive 
events in real time without polling (e.g. trying to get the server status every few seconds).

#### Server status events
You can simply connect to the websocket API for a server by running the `subscribe()` function.
```js
server.subscribe();
```

By default, you are always subscribed to server status update events, you can
react to server status changes by adding a listener:
```js
server.subscribe();
server.on("status", function(server) {
    console.log(server.status);
});
```
This event is not only triggered when the status itself changes but also when other
events happen, e.g. a player joins the server.

#### Console
There are several optional streams that you can subscribe to, e.g. 
the console.
```js
server.subscribe("console");
```
The console stream emits an event for every new console line.
```js
server.subscribe("console");
server.on("console:line", function(data) {
    console.log(data.line);
});
```
The `data.line` property is already cleaned up for easier use in this client library, you can use `data.rawLine` if you want the raw
data with all formatting codes etc.

The console stream also allows you to send commands directly over the websocket. This is faster because the connection is already
established and no further authorization etc. is necessary. This library already checks if you are subscribed to the console stream
and sends the command through that stream instead, so you can just use it the same way as before:
```js
try {
    await server.executeCommand("say Hello world!");
} catch (e) {
    console.error(e.message);
}
```

#### Tick times
On Minecraft Java edition servers with version 1.16 and higher it is possible to get the tick times, and the TPS (ticks per second) of your server.
This information is also available as an optional stream.
```js
server.subscribe("tick");
server.on("tick:tick", function(data) {
    console.log("Tick time: " + data.averageTickTime + "ms");
    console.log("TPS: " + data.tps);
});
```

#### RAM usage
There are two different optional streams to get RAM usage, the general `stats` stream and the Java specific `heap` stream.
It is recommended to use the `heap` stream if you are running a server software that is based on Java. It is not recommended using both.

You can subscribe to multiple streams at once by passing an array to the subscribe function.
```js
server.subscribe(["stats", "heap"]);
server.on("stats:stats", function(data) {
    console.log(data.memory.usage);
});
server.on("heap:heap", function(data) {
    console.log(data.usage);
});
```

#### Unsubscribe
You can unsubscribe from one, multiple or all streams using the `server.unsubscribe()` function.

```js
server.unsubscribe("console");
server.unsubscribe(["tick", "heap"]);
server.unsubscribe(); // this disconnects the websocket connection
```