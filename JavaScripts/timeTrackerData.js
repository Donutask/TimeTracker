"use strict";
class TimeTrackerData {
    constructor(title, timespans) {
        this.title = title;
        this.timespans = timespans;
        this.startDate = null;
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
    Remove(timespan) {
        const index = this.timespans.indexOf(timespan);
        if (index > -1) {
            this.timespans.splice(index, 1);
        }
    }
    GetAllSpansForDate(year, month, date) {
        let array = [];
        for (let i = 0; i < this.timespans.length; i++) {
            const element = this.timespans[i];
            if (element.start.getFullYear() == year && element.start.getMonth() == month && element.start.getDate() == date) {
                array.push(element);
            }
        }
        if (array == null || array.length <= 0) {
            return null;
        }
        else {
            return array;
        }
    }
    Serialize() {
        let dateString;
        if (this.startDate == null) {
            dateString = "";
        }
        else {
            dateString = this.startDate.getTime().toString();
        }
        let json = `{"title":"${this.title}", "startDate":"${dateString}", "timestamps":[`;
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
