//Has a start and end Date. Can use to calculate duration between those dates.
class Timespan {
    start: Date;
    end: Date;
    note: string; //not used

    constructor(start: Date, end: Date) {
        this.start = start;
        this.end = end;
        this.note = "";
    }

    //Minutes
    GetMinutes(): number {
        return dateDiffInMinutes(this.start, this.end);
    }

    //Format as HH:MM - HH:MM (Total Hours) string (with note if it exists)
    Format(): string {
        let formatted = `${formatAMPM(this.start)} - ${formatAMPM(this.end)} (${formatHoursMinutes(this.GetMinutes())})`;

        if (this.note != null && this.note.length > 0) {
            return formatted + ` [${this.note}]`;
        } else {
            return formatted;
        }
    }

    //Returns JSON encoding of object
    Serialise(): string {
        return `{"start":${this.start.getTime()},"end":${this.end.getTime()}}`
    }

    //Deserialises JSON string to Timespan object
    static FromJSON(json: string): Timespan {
        let parsed = JSON.parse(json);
        let start = new Date(parsed.start);
        let end = new Date(parsed.end);

        return new Timespan(start, end);
    }
}