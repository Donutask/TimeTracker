"use strict";
class Timespan {
    GetMinutes() {
        return dateDiffInMinutes(this.start, this.end);
    }
    constructor(start, end, note) {
        this.start = start;
        this.end = end;
        this.note = note;
    }
    Serialise() {
        return `{"start":${this.start.getTime()},"end":${this.end.getTime()}}`;
    }
    static FromJSON(json) {
        let parsed = JSON.parse(json);
        let start = new Date(parsed.start);
        let end = new Date(parsed.end);
        return new Timespan(start, end, "");
    }
}
