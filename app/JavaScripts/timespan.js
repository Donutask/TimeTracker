"use strict";
class Timespan {
    constructor(start, end) {
        this.start = start;
        this.end = end;
        this.note = "";
    }
    GetMinutes() {
        return DateTime.DifferenceInMinutes(this.start, this.end);
    }
    Serialise() {
        return `{"start":"${this.start.ToString()}","end":"${this.end.ToString()}"}`;
    }
    static FromJSON(json) {
        let parsed = JSON.parse(json);
        let start = DateTime.FromString(parsed.start);
        let end = DateTime.FromString(parsed.end);
        return new Timespan(start, end);
    }
}
