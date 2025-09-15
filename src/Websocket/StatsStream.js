import Stream from './Stream.js'

export default class StatsStream extends Stream {
    name = "stats";
    startStatuses = [1];
}
