"use strict";
class Timespan {
    constructor(start, end) {
        this.start = start;
        this.end = end;
        this.note = "";
    }
    GetMinutes() {
        return dateDiffInMinutes(this.start, this.end);
    }
    Format() {
        let formatted = `${formatAMPM(this.start)} - ${formatAMPM(this.end)} (${formatHoursMinutes(this.GetMinutes())})`;
        if (this.note != null && this.note.length > 0) {
            return formatted + ` [${this.note}]`;
        }
        else {
            return formatted;
        }
    }
    Serialise() {
        return `{"start":${this.start.getTime()},"end":${this.end.getTime()}}`;
    }
    static FromJSON(json) {
        let parsed = JSON.parse(json);
        let start = new Date(parsed.start);
        let end = new Date(parsed.end);
        return new Timespan(start, end);
    }
}
