const millisecondsPerMinute = 1000 * 60;
const millisecondsPerHour = millisecondsPerMinute * 60;

function dateDiffInHours(startDate: Date, endDate: Date): number {
    let hours = (endDate.getTime() - startDate.getTime()) / millisecondsPerHour;
    return hours;
}
function dateDiffInMinutes(startDate: Date, endDate: Date): number {
    let minutes = (endDate.getTime() - startDate.getTime()) / millisecondsPerMinute;
    return minutes;
}
//https://stackoverflow.com/a/8888498
function formatAMPM(date: Date): string {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    let minuteString = minutes < 10 ? '0' + minutes : minutes.toString();

    let strTime = hours + ':' + minuteString + ' ' + ampm;
    return strTime;
}

// https://stackoverflow.com/a/9035732
function randomDate(start: Date, end: Date) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

//Will show hours and minutes, or just minutes if less than an hour
function formatHoursMinutes(totalMinutes: number): string {
    //In case something goes very wrong
    if (Number.isNaN(totalMinutes)) {
        return "?";
    }
    if (!Number.isFinite(totalMinutes)) {
        return "Forever";
    }
    //Days
    if (totalMinutes > 60 * 99) {
        let days = Math.floor(totalMinutes / (60 * 24));
        let hours = Math.floor((totalMinutes / 60) % 24);
        let minutes = totalMinutes % 60;

        return `${days}d ${hours}h ${Math.floor(minutes)}m`;
    }
    //Hours
    if (totalMinutes > 60) {
        let hours = Math.floor(totalMinutes / 60);
        let minutes = totalMinutes % 60;

        return `${hours}hr ${Math.floor(minutes)}min`;

    }
    //Minutes
    else {
        return `${Math.floor(totalMinutes)}min`;
    }
}   