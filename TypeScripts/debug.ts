namespace Debug {
    function GenerateGibberishData() {
        let times: Timespan[] = [];

        for (let i = 0; i < 100; i++) {
            let start = randomDate(new Date(2025, 0, 1), new Date());
            let end = new Date(start.getTime() + (Math.random() * 60 * 60 * 1000));
            times.push(new Timespan(DateTime.FromJsDate(start), DateTime.FromJsDate(end)))
        }

        mainData = new TimeTrackerData();
        mainData.title = "Test Data"
        mainData.timespans = times;
    }

    // https://stackoverflow.com/a/9035732
    function randomDate(start: Date, end: Date): Date {
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    }

    //https://stackoverflow.com/a/63526476
    function ClearCache() {
        caches.keys().then((keyList) => Promise.all(keyList.map((key) => caches.delete(key))))
    }

    // https://stackoverflow.com/a/62455421/13657726
    const debugTools: { [K: string]: Function } = {
        clearCache: ClearCache,
        randomData: GenerateGibberishData,
    };

    export function runDebugTool(name: string) {
        if (debugTools[name]) {
            alert("Executed function: " + name);
            return debugTools[name]();
        }

        alert(`Error: Method '${name}' is not implemented.`);
    }
}