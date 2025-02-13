const millisecondsPerMinute = 1000 * 60;

//A simpler class than JS dates
class DateTime {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;

    constructor(y: number, m: number, d: number, h: number, min: number) {
        this.year = y;
        this.month = m;
        this.day = d;
        this.hour = h
        this.minute = min
    }

    IsValid(): boolean {
        //All 0 = null date
        if (this.year == 0 && this.month == 0 && this.day == 0 && this.hour == 0 && this.minute == 0) {
            return false;
        }
        //Too small
        if (this.year < 0 || this.month < 0 || this.day < 0 || this.hour < 0 || this.minute < 0) {
            return false;
        }
        //To big
        if (this.month > 12 || this.day > 31 || this.hour > 24 || this.minute > 60) {
            return false;
        }
        return true;
    }

    static IsNull(date: DateTime | null): boolean {
        if (date == null || date == undefined) {
            return true;
        }
        //All 0 = null date
        if (date.year == 0 && date.month == 0 && date.day == 0 && date.hour == 0 && date.minute == 0) {
            return true;
        }
        return false;
    }

    //Returns new DateTime object with same properties
    Clone(): DateTime {
        return new DateTime(this.year, this.month, this.day, this.hour, this.minute);
    }

    //Formatted as all components seperated by spaces
    ToString(): string {
        const seperator = " ";
        return this.year + seperator + this.month + seperator + this.day + seperator + this.hour + seperator + this.minute;
    }

    //Year, month, day
    ToDateString(): string {
        return this.year + "/" + this.month + "/" + this.day;
    }

    static FromString(str: string): DateTime {
        //A bunch of null checks
        if (str == null || str.length <= 0) {
            return DateTime.NullDate();
        }

        //Sometimes its not actually a string
        str = str.toString();

        //Split the string along spaces
        const seperator = " ";
        let split = str.split(seperator);

        if (split == null || split.length <= 0) {
            return DateTime.NullDate();
        }

        //Read strings as numbers
        let numbers = [];
        for (let i = 0; i < split.length; i++) {
            const item = split[i];
            const n = Number.parseInt(item);

            if (!Number.isNaN(n)) {
                numbers.push(n);
            }
        }

        //Must have exactly 5 numbers to be valid
        if (numbers == null || numbers.length != 5) {
            return DateTime.NullDate();
        }

        return new DateTime(numbers[0], numbers[1], numbers[2], numbers[3], numbers[4]);
    }

    ToJsDate(): Date {
        return new Date(this.year, this.month, this.day, this.hour, this.minute);
    }

    static FromJsDate(date: Date): DateTime {
        return new DateTime(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes());
    }

    static Now(): DateTime {
        return DateTime.FromJsDate(new Date());
    }

    static NullDate(): DateTime {
        return new DateTime(0, 0, 0, 0, 0);
    }

    //True if year, month, and day are same
    static IsSameDate(a: DateTime, b: DateTime): boolean {
        return a.year == b.year && a.month == b.month && a.day == b.day;
    }

    //it just converts to normal Date because I don't know how to implement
    static DifferenceInMinutes(startDate: DateTime, endDate: DateTime): number {
        let minutes = (endDate.ToJsDate().getTime() - startDate.ToJsDate().getTime()) / millisecondsPerMinute;
        return minutes;
    }

    //https://stackoverflow.com/a/8888498
    static formatAMPM(date: DateTime): string {
        let hours = date.hour;
        let minutes = date.minute;
        let ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        let minuteString = minutes < 10 ? '0' + minutes : minutes.toString();

        let strTime = hours + ':' + minuteString + ' ' + ampm;
        return strTime;
    }

    //Will show hours and minutes, or just minutes if less than an hour
    static formatHoursMinutes(totalMinutes: number): string {
        //In case something goes very wrong
        if (Number.isNaN(totalMinutes)) {
            return "?";
        }
        if (!Number.isFinite(totalMinutes)) {
            return "Forever";
        }

       const sign :string= Math.sign(totalMinutes) < 0 ? "-" : "";
        //Round it to hopefully avoid off-by-one errors
        totalMinutes = Math.abs(Math.round(totalMinutes));

        //Days
        if (totalMinutes >= 60 * 99) {
            let days = Math.floor(totalMinutes / (60 * 24));
            let hours = Math.floor((totalMinutes / 60) % 24);
            let minutes = totalMinutes % 60;

            return sign+`${days}d ${hours}h ${Math.floor(minutes)}m`;
        }
        //Hours
        if (totalMinutes >= 60) {
            let hours = Math.floor(totalMinutes / 60);
            let minutes = totalMinutes % 60;

            return sign+`${hours}hr ${minutes}min`;

        }
        //Minutes
        else {
            return sign+`${Math.floor(totalMinutes)}min`;
        }
    }

    //HH:mm, with leading zeros
    FormatForTimeInput(): string {
        let hourString: string;
        if (this.hour < 10) {
            hourString = "0" + this.hour;
        } else {
            hourString = this.hour.toString();
        }

        let minuteString: string;
        if (this.minute < 10) {
            minuteString = "0" + this.minute
        } else {
            minuteString = this.minute.toString();
        }

        return hourString + ":" + minuteString;
    }

    //Apply HH:mm string to the current object
    ChangeHoursMinutesFromTimeInputString(value: string) {
        let numbers = DateTime.ReadHoursMinutesFromTimeInputString(value);

        if (numbers != null) {
            this.hour = numbers[0];
            this.minute = numbers[1];
        }
    }

    static ReadHoursMinutesFromTimeInputString(value: string): [number, number] | null {
        let split = value.split(":");
        if (split == null || split.length != 2) {
            return null;
        }

        let numbers = [];
        for (let i = 0; i < split.length; i++) {
            const element = split[i];
            const n = Number.parseInt(element);

            if (!Number.isNaN(n)) {
                numbers.push(n);
            }
        }

        if (numbers == null || numbers.length != 2) {
            return null;
        }

        return [numbers[0], numbers[1]]
    }

}