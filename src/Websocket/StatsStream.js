const Stream = require("./Stream");

class StatsStream extends Stream {
    name = "stats";
    startStatuses = [1];
}

module.exports = StatsStream;