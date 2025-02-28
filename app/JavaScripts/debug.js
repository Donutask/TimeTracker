"use strict";
function GenerateGibberishData() {
    let times = [];
    for (let i = 0; i < 100; i++) {
        let start = randomDate(new Date(2025, 0, 1), new Date());
        let end = new Date(start.getTime() + (Math.random() * 60 * 60 * 1000));
        times.push(new Timespan(DateTime.FromJsDate(start), DateTime.FromJsDate(end)));
    }
    mainData = new TimeTrackerData("Test Data", times);
}
function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}
function ClearCache() {
    caches.keys().then((keyList) => Promise.all(keyList.map((key) => caches.delete(key))));
}
