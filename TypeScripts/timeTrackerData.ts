class TimeTrackerData {
    title: string;
    timespans: Timespan[];

    constructor(title: string, timespans: Timespan[]) {
        this.title = title;
        this.timespans = timespans;
    }

    //Adds all timespans
    GetTotalMinutes(): Number {
        let totalMinutes = 0;

        for (let i = 0; i < this.timespans.length; i++) {
            const element = this.timespans[i];

            totalMinutes = element.GetMinutes();
        }

        return totalMinutes;
    }

    //Push to list
    Add(timespan: Timespan) {
        if (this.timespans == null) {
            this.timespans = [];
        }
        this.timespans.push(timespan);
    }

    //Turns data into JSON
    Serialize(): string {
        let json = `{"title":"${this.title}", "timestamps":[`;

        //Only process timestamps if they exist
        if (this.timespans != null && this.timespans.length > 0) {
            for (let i = 0; i < this.timespans.length; i++) {
                const element = this.timespans[i];
                json += element.Serialise() + ",";
            }
            json = json.slice(0, -1);
        }
        json += "]}";

        return json;
    }
}