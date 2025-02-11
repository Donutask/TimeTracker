//Has a start and end Date. Can use to calculate duration between those dates.
class Timespan {
    start: DateTime;
    end: DateTime;
    note: string; //not used

    constructor(start: DateTime, end: DateTime) {
        this.start = start;
        this.end = end;
        this.note = "";
    }

    //Minutes
    GetMinutes(): number {
        return DateTime.DifferenceInMinutes(this.start, this.end);
    }

    //Returns JSON encoding of object
    Serialise(): string {
        return `{"start":"${this.start.ToString()}","end":"${this.end.ToString()}"}`
    }

    //Deserialises JSON string to Timespan object
    static FromJSON(json: string): Timespan {
        let parsed = JSON.parse(json);
        let start = DateTime.FromString(parsed.start);
        let end = DateTime.FromString(parsed.end);

        return new Timespan(start, end);
    }
}