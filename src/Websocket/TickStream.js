import Stream from './Stream.js'

export default class TickStream extends Stream {
    name = "tick";
    startStatuses = [1];

    onDataMessage(type, message) {
        switch(type) {
            case "tick":
                message.data.tps = Math.round(Math.min(1000 / message.data.averageTickTime, 20) * 10) / 10;
                this.emitEvent("tick", message.data);
        }
    }
}
