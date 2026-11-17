# Node.js exaroton API client

## About
The exaroton API allows automated access to some basic functionalities of your game servers, such as starting or stopping 
the server. You can read the API documentation here: https://developers.exaroton.com

This is the official Node.js implementation of this API.

### Requirements
- Node 22 or later

### Installation

```
npm install exaroton
```

## Usage
To use the API and this client you have to get your API key, which you can generate in your exaroton account settings: https://exaroton.com/account


### Create a client object
```js
import {Client} from 'exaroton'

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

#### Paginated lists
Transactions and backups are returned in pages of 20 items, newest first. Each method takes the page number
(starting at 1) and returns a [Page](./src/Page/Page.js) object with the fields `items`, `page`, `lastPage` and `total`.
Pages after the last page are empty.
```js
let account = await client.getAccount();
let page = 1, transactions;
do {
    transactions = await account.getTransactions(page++);
    for (let transaction of transactions.items) {
        console.log(transaction.type + ": " + transaction.credits);
    }
} while (transactions.hasNextPage());
```
The same works for `server.getTransactions(page)`, `pool.getTransactions(page)` and `server.getBackups(page)`.
`credits` are seen from the perspective of the account, server or pool the list belongs to.

#### List regions
```js
let regions = await client.getRegions();
for (let region of regions) {
    console.log(region.id + ": " + region.name);
}
```
Use the region ID when creating or transferring a server. The region of a server is available as `server.region`.

#### List servers
```js
let servers = await client.getServers();

for(let server of servers) {
    console.log(server.name + ": " + server.id);
}
```

Each server object contains the fields and information as listed in the [documentation](https://developers.exaroton.com/#servers-get).

#### Create a new server
```js
try {
    let server = await client.createServer({
        name: "example",
        softwareType: "vanilla", // or software: "<software id>"
        motd: "My cool server!", // optional
        timezone: "Europe/Berlin", // optional, defaults to UTC
        region: "eu", // optional, see client.getRegions()
    });
    console.log("Created server " + server.address);
} catch (e) {
    console.error(e.message);
}
```
If the preferred name is taken, a random name based on it is generated. Creating a server fails if your account
has reached its server limit (see `account.maxServers`).

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
the [ServerStatus](./src/Server/ServerStatus.js) object, which you can require on its own `import {ServerStatus} from 'exaroton'` or via the
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

#### Delete the server
```js
try {
    await server.delete();
} catch (e) {
    console.error(e.message);
}
```
*This permanently deletes the server including all of its files. It is only possible for the owner of the server
and only while the server is offline or crashed.*

#### Execute a server command
```js
try {
    await server.executeCommand("say Hello world!");
} catch (e) {
    console.error(e.message);
}
```

#### Extend the server stop timer
```js
try {
    await server.extendStopTime(60);
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

#### Server properties
Server properties are settings such as automatic stopping and starting. Only properties that are available for the server
and that you are allowed to change are returned.
```js
try {
    let properties = await server.getProperties();
    console.log(properties["autostop"], properties["autostop-time"]);

    // only the given properties are changed, either all or none of them
    properties = await server.setProperties({"autostop": true, "autostop-time": 10});
} catch (e) {
    console.error(e.message);
}
```

#### Transfer the server to another region
```js
try {
    await server.transfer("na");
} catch (e) {
    console.error(e.message);
}
```
The server has to be offline. The transfer runs in the background: the server has the status `TRANSFERRING` while
its files are copied and returns to its previous status with the new `region` afterwards. Poll `server.get()` or
listen to the websocket `status` event to see when it's done.

#### Backups
Backups are stored in backup accounts (e.g. Google Drive, Dropbox or OneDrive) linked to the server.
Backup accounts can only be linked in the exaroton panel.

##### List backups
```js
let backups = await server.getBackups(); // first page, see "Paginated lists"
console.log(backups.running); // true while a backup is being created or restored
for (let backup of backups.items) {
    console.log(backup.id + ": " + backup.name + " (" + backup.status + ")");
}
```

##### Create a backup
```js
try {
    let backup = await server.createBackup({
        name: "Before the update", // optional
        backupAccount: backupAccountId, // optional, defaults to the first linked backup account
    });
    while (backup.isCreating()) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        await backup.get();
    }
} catch (e) {
    console.error(e.message);
}
```
The backup is created in the background and has the status `creating` until it is done. If creating the backup fails,
the backup is deleted, so `backup.get()` fails with status code 404.

##### Rename, restore or delete a backup
```js
let backup = server.getBackup(backupId);
try {
    await backup.get();
    await backup.rename("New name"); // an empty name resets it to the default name
    await backup.restore();
    await backup.delete();
} catch (e) {
    console.error(e.message);
}
```
Restoring a backup replaces the current server files and requires the server to be offline. The restore runs in the
background, `running` in `server.getBackups()` is `true` until it is done. Don't start the server before that.

##### Backup accounts
```js
let accounts = await server.getBackupAccounts();
for (let account of accounts) {
    console.log(account.name + " (" + account.provider + "): " + account.storage.used + " / " + account.storage.limit);
}
```

##### Automatic backup settings
```js
let settings = await server.getBackupSettings();
console.log(settings.enabled, settings.limit, settings.interval);

// settings that are not included are kept
settings = await server.setBackupSettings({enabled: true, limit: 10, interval: 86400});
```

#### Custom domains

##### List domains
```js
let domains = await server.getDomains();
for (let domain of domains) {
    console.log(domain.domain + ": " + domain.status);
}
```

##### Add a domain
```js
try {
    let domain = await server.addDomain("play.example.com");
    console.log("Set the NS records of your domain to: " + domain.nameservers.join(", "));
} catch (e) {
    console.error(e.message);
}
```
The domain stays `pending` until its NS records point to the listed nameservers. Use `domain.check()` to check again
(at most every 10 seconds).

##### Check, change or remove a domain
```js
let domain = server.getDomain(domainId);
try {
    await domain.get();
    await domain.check();
    await domain.update({protocol: "https", port: 8080});
    await domain.delete();
} catch (e) {
    console.error(e.message);
}
```

#### Share Access
Share your server with other exaroton accounts. The available permissions are listed in the
[documentation](https://developers.exaroton.com/).

##### List accounts with access
```js
let accessList = await server.getAccessList();
for (let access of accessList) {
    console.log(access.account.name + ": " + access.permissions.join(", "));
}
```

##### Share the server
```js
try {
    let access = await server.addAccess("username", ["server", "stop", "console"]); // permissions default to ["server"]
} catch (e) {
    console.error(e.message);
}
```

##### Change permissions or remove access
```js
let access = server.getAccess(accessId);
try {
    await access.get();
    await access.setPermissions(["server", "stop"]);
    await access.delete();
} catch (e) {
    console.error(e.message);
}
```

#### Server transactions
```js
let transactions = await server.getTransactions(); // first page, see "Paginated lists"
console.log(transactions.items);
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

##### List files in a directory
```js
try {
    // get the children of the directory
    let children = await file.getChildren();
    console.log(children);
    
    // iterate over the children
    // each child is a file object
    for (let child of children) {
        console.log(child);
    }
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
    await file.putContent("Hello world!");
    
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

#### Config files
Config files are files that contain server configuration and are shown as forms rather than plain text files in the exaroton panel.
You can get a config file object by using the `getConfig()` method on a file object.
Whether a file is a config file can be checked using the `isConfigFile` property.

```js
let file = server.getFile("server.properties");
let config = file.getConfig();
```

##### Get config file options
```js
let options = await config.getOptions();
for(let [key, option] of options) {
    console.log(key, option.getValue());
}
```

##### Update config file options
```js
let options = await config.getOptions();

options.get("max-players").setValue(26);
options.get("pvp").setValue(false);

await config.save();
```

Options of type `select` or `multiselect` have a list of possible values.
```js
let options = await config.getOptions();
console.log(options.get("difficulty").getOptions());
```

#### Software

##### List available software
```js
let software = await client.getSoftware();
console.log(software);

// Optionally filter by software type and/or launcher
let vanilla = await client.getSoftware("vanilla");
let curseForgeModpacks = await client.getSoftware(null, "CurseForge");
```

##### Get information about installing a software on a server
```js
let details = await server.getSoftwareDetails(softwareId);
console.log(details.name + " " + details.version + " requires a reinstall: " + details.reinstall);
```

##### Install a software on a server
```js
try {
    let details = await server.getSoftwareDetails(softwareId);
    // If a reinstall is required, all server files will be deleted
    await server.installSoftware(softwareId, details.reinstall);
} catch (e) {
    console.error(e.message);
}
```

#### Credit pools
Credit pools allow sharing the costs of a server between multiple users. 

##### List credit pools
```js
let pools = await client.getPools();
console.log(pools);
```

##### Create a pool object by ID
```js
let server = client.pool(id);
```

##### Get pool information
```js
await pool.get();
console.log(pool.name + ": " + pool.credits);
```

##### Get pool members
```js
let members = await pool.getMembers();
console.log(members);
```

##### Get pool servers
```js
let servers = await pool.getServers();
console.log(servers);
```

##### Get pool transactions
```js
let transactions = await pool.getTransactions(); // first page, see "Paginated lists"
console.log(transactions.items);
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

### Management Protocol
The Minecraft server management protocol introduced in 1.21.9 allows controlling various server settings without
restarting the server and receiving events from the server. This API client supports proxying this protocol through the
exaroton websocket connection and using it with the [`mc-server-management`](https://github.com/aternosorg/mc-server-management)
library.

```js
// To use it, first subscribe to the `management` stream:
server.subscribe("management");
// Then get a connection object from the stream:
const connection = server.getWebsocketClient().getStream("management").getProxyConnection();
// And create an object from the management library:
import {MinecraftServer} from "mc-server-management";
const mcServer = new MinecraftServer(stream.getProxyConnection());

// Now you can perform requests such as getting the server status:
let status = await mcServer.getStatus();

// And subscribe to notifications:
import {Notifications} from "mc-server-management";
mcServer.on(Notifications.ALLOWLIST_ADDED, data => {
    console.log("Allowlist added", data);
});
```


#### Unsubscribe
You can unsubscribe from one, multiple or all streams using the `server.unsubscribe()` function.

```js
server.unsubscribe("console");
server.unsubscribe(["tick", "heap"]);
server.unsubscribe(); // this disconnects the websocket connection
```
