class Timespan {
    start: Date;
    end: Date;
    note: string;

    //Minutes
    GetMinutes(): number {
        return dateDiffInMinutes(this.start, this.end);
    }

    constructor(start: Date, end: Date, note: string) {
        this.start = start;
        this.end = end;
        this.note = note;
    }


    Serialise(): string {
        return `{"start":${this.start.getTime()},"end":${this.end.getTime()}}`
    }

    static FromJSON(json: string): Timespan {
        let parsed = JSON.parse(json);
        let start = new Date(parsed.start);
        let end = new Date(parsed.end);

        return new Timespan(start, end, "");
    }
}