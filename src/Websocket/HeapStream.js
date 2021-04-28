const Stream = require("./Stream");

class HeapStream extends Stream {
    name = "heap";
    startStatuses = [1];
}

module.exports = HeapStream;