"use strict";
class TimeTrackerData {
    constructor(title, timespans) {
        this.title = title;
        this.timespans = timespans;
    }
    GetTotalMinutes() {
        let totalMinutes = 0;
        for (let i = 0; i < this.timespans.length; i++) {
            const element = this.timespans[i];
            totalMinutes = element.GetMinutes();
        }
        return totalMinutes;
    }
    Add(timespan) {
        if (this.timespans == null) {
            this.timespans = [];
        }
        this.timespans.push(timespan);
    }
    Serialize() {
        let json = `{"title":"${this.title}", "timestamps":[`;
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
