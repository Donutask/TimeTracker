"use strict";
const millisecondsPerMinute = 1000 * 60;
class DateTime {
    constructor(y, m, d, h, min) {
        this.year = y;
        this.month = m;
        this.day = d;
        this.hour = h;
        this.minute = min;
    }
    IsValid() {
        if (this.year == 0 && this.month == 0 && this.day == 0 && this.hour == 0 && this.minute == 0) {
            return false;
        }
        if (this.year < 0 || this.month < 0 || this.day < 0 || this.hour < 0 || this.minute < 0) {
            return false;
        }
        if (this.month > 12 || this.day > 31 || this.hour > 24 || this.minute > 60) {
            return false;
        }
        return true;
    }
    static IsNull(date) {
        if (date == null || date == undefined) {
            return true;
        }
        if (date.year == 0 && date.month == 0 && date.day == 0 && date.hour == 0 && date.minute == 0) {
            return true;
        }
        return false;
    }
    Clone() {
        return new DateTime(this.year, this.month, this.day, this.hour, this.minute);
    }
    ToString() {
        const seperator = " ";
        return this.year + seperator + this.month + seperator + this.day + seperator + this.hour + seperator + this.minute;
    }
    ToDateString() {
        return this.year + "/" + this.month + "/" + this.day;
    }
    static FromString(str) {
        if (str == null || str.length <= 0) {
            return DateTime.NullDate();
        }
        str = str.toString();
        const seperator = " ";
        let split = str.split(seperator);
        if (split == null || split.length <= 0) {
            return DateTime.NullDate();
        }
        let numbers = [];
        for (let i = 0; i < split.length; i++) {
            const item = split[i];
            const n = Number.parseInt(item);
            if (!Number.isNaN(n)) {
                numbers.push(n);
            }
        }
        if (numbers == null || numbers.length != 5) {
            return DateTime.NullDate();
        }
        return new DateTime(numbers[0], numbers[1], numbers[2], numbers[3], numbers[4]);
    }
    ToJsDate() {
        return new Date(this.year, this.month, this.day, this.hour, this.minute);
    }
    static FromJsDate(date) {
        return new DateTime(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes());
    }
    static Now() {
        return DateTime.FromJsDate(new Date());
    }
    static NullDate() {
        return new DateTime(0, 0, 0, 0, 0);
    }
    static IsSameDate(a, b) {
        return a.year == b.year && a.month == b.month && a.day == b.day;
    }
    static DifferenceInMinutes(startDate, endDate) {
        let minutes = (endDate.ToJsDate().getTime() - startDate.ToJsDate().getTime()) / millisecondsPerMinute;
        return minutes;
    }
    static formatAMPM(date) {
        let hours = date.hour;
        let minutes = date.minute;
        let ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12;
        let minuteString = minutes < 10 ? '0' + minutes : minutes.toString();
        let strTime = hours + ':' + minuteString + ' ' + ampm;
        return strTime;
    }
    static formatHoursMinutes(totalMinutes) {
        if (Number.isNaN(totalMinutes)) {
            return "?";
        }
        if (!Number.isFinite(totalMinutes)) {
            return "Forever";
        }
        const sign = Math.sign(totalMinutes) < 0 ? "-" : "";
        totalMinutes = Math.abs(Math.round(totalMinutes));
        if (totalMinutes >= 60 * 99) {
            let days = Math.floor(totalMinutes / (60 * 24));
            let hours = Math.floor((totalMinutes / 60) % 24);
            let minutes = totalMinutes % 60;
            return sign + `${days}d ${hours}h ${Math.floor(minutes)}m`;
        }
        if (totalMinutes >= 60) {
            let hours = Math.floor(totalMinutes / 60);
            let minutes = totalMinutes % 60;
            return sign + `${hours}hr ${minutes}min`;
        }
        else {
            return sign + `${Math.floor(totalMinutes)}min`;
        }
    }
    FormatForTimeInput() {
        let hourString;
        if (this.hour < 10) {
            hourString = "0" + this.hour;
        }
        else {
            hourString = this.hour.toString();
        }
        let minuteString;
        if (this.minute < 10) {
            minuteString = "0" + this.minute;
        }
        else {
            minuteString = this.minute.toString();
        }
        return hourString + ":" + minuteString;
    }
    ChangeHoursMinutesFromTimeInputString(value) {
        let numbers = DateTime.ReadHoursMinutesFromTimeInputString(value);
        if (numbers != null) {
            this.hour = numbers[0];
            this.minute = numbers[1];
        }
    }
    static ReadHoursMinutesFromTimeInputString(value) {
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
        return [numbers[0], numbers[1]];
    }
}
