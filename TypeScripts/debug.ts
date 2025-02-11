function GenerateGibberishData() {
    let times: Timespan[] = [];

    for (let i = 0; i < 100; i++) {
        let start = randomDate(new Date(2025, 0, 1), new Date());
        let end = new Date(start.getTime() + (Math.random() * 60 * 60 * 1000));
        times.push(new Timespan(DateTime.FromJsDate(start), DateTime.FromJsDate(end)))
    }

    mainData = new TimeTrackerData("Test Data", times);
}

// https://stackoverflow.com/a/9035732
function randomDate(start: Date, end: Date) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}