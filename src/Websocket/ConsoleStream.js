const Stream = require("./Stream");

class ConsoleStream extends Stream {
    #ansiRegex = new RegExp('[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)|(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))', "g");
    name = "console";
    startData = {tail: 0};

    onDataMessage(type, message) {
        switch (type) {
            case "line":
                this.emitEvent("line", {rawLine: message.data, line: this.parseLine(message.data)});
        }
    }

    parseReturns(str) {
        str = str.replace(/^\r|\r$/, '');
        let rIndex = str.lastIndexOf('\r');
        if (rIndex !== -1) {
            str = str.substr(rIndex + 1);
        }
        return str;
    }

    parseLine(line) {
        return this.parseReturns(line).replace(this.#ansiRegex, '');
    }

    sendCommand(command) {
        this.send("command", command);
    }
}

module.exports = ConsoleStream;