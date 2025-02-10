"use strict";
const millisecondsPerMinute = 1000 * 60;
const millisecondsPerHour = millisecondsPerMinute * 60;
function dateDiffInHours(startDate, endDate) {
    let hours = (endDate.getTime() - startDate.getTime()) / millisecondsPerHour;
    return hours;
}
function dateDiffInMinutes(startDate, endDate) {
    let minutes = (endDate.getTime() - startDate.getTime()) / millisecondsPerMinute;
    return minutes;
}
function formatAMPM(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    let minuteString = minutes < 10 ? '0' + minutes : minutes.toString();
    let strTime = hours + ':' + minuteString + ' ' + ampm;
    return strTime;
}
function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}
function formatHoursMinutes(totalMinutes) {
    if (Number.isNaN(totalMinutes)) {
        return "?";
    }
    if (!Number.isFinite(totalMinutes)) {
        return "Forever";
    }
    totalMinutes = Math.round(totalMinutes);
    if (totalMinutes > 60 * 99) {
        let days = Math.floor(totalMinutes / (60 * 24));
        let hours = Math.floor((totalMinutes / 60) % 24);
        let minutes = totalMinutes % 60;
        return `${days}d ${hours}h ${Math.floor(minutes)}m`;
    }
    if (totalMinutes >= 60) {
        let hours = Math.floor(totalMinutes / 60);
        let minutes = totalMinutes % 60;
        return `${hours}hr ${minutes}min`;
    }
    else {
        return `${Math.floor(totalMinutes)}min`;
    }
}
