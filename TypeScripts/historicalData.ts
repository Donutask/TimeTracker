class TimeTrackerData {
    title: string;
    timespans: Timespan[];

    constructor(title: string, timespans: Timespan[]) {
        this.title = title;
        this.timespans = timespans;
    }

    //Add hours of all timespans
    GetTotalHours(): Number {
        let totalMs = 0;

        for (let i = 0; i < this.timespans.length; i++) {
            const element = this.timespans[i];

            totalMs = element.GetMinutes();
        }

        return new Number(totalMs);
    }

    Add(timespan: Timespan) {
        this.timespans.push(timespan);
    }


    Serialize(): string {
        let json = `{"title":"${this.title}", "timestamps":[`;

        if (this.timespans != null && this.timespans.length > 0) {
            for (let i = 0; i < this.timespans.length; i++) {
                const element = this.timespans[i];
                json += element.Serialise() + ",";
            }
            json = json.slice(0, -1);
        }
        json += "]}";

        console.log(json);
        return json;
    }


}

// class MonthData {
//     month: number;
//     year: number;
//     //first index = day of month, second is list of the timespans
//     // timespans: Dictionary<Timespan[]>;

//     constructor(month: number, year: number, data: TimeTrackerData) {
//         this.month = month;
//         this.year = year;

//         let timestamps: Dictionary<Timespan[]>;

//         for (let i = 0; i < data.timespans.length; i++) {
//             const element = data.timespans[i];

//             if (element.start.getFullYear() == year && element.start.getMonth() == month) {
//                 // timestamps.add
//             }
//         }
//     }
// }

// interface Dictionary<T> {
//     [Key: number]: T;
// }