class SaveSlot {
    storageKey: string;
    private title: string | null = null;
    private data: TimeTrackerData | null = null;

    constructor(key: string) {
        this.storageKey = key;
    }

    GetTitle() {
        if (this.title == null) {
            const data = this.GetData();
            if (data != null) {
                this.title = data.title;
            }
        }
        return this.title;
    }

    GetData(): TimeTrackerData | null {
        if (this.data == null) {
            const stringContent = localStorage.getItem(this.storageKey);
            if (stringContent == null) {
                return null;
            } else {
                let parsedJSON;
                try {
                    parsedJSON = JSON.parse(stringContent);
                } catch (e) {
                    console.error(e);
                    return null;
                }

                //deserialise timestamps
                let timestamps: Timespan[] = [];
                for (let i = 0; i < parsedJSON.timestamps.length; i++) {
                    let element = parsedJSON.timestamps[i];
                    element = JSON.stringify(element);
                    timestamps.push(Timespan.FromJSON(element));
                }

                this.data = new TimeTrackerData(parsedJSON.title, timestamps);
                if (parsedJSON.notes != null)
                    this.data.notes = parsedJSON.notes;
            }
        }

        return this.data;
    }

    SaveData(data: TimeTrackerData) {
        localStorage.setItem(this.storageKey, data.Serialize());
    }
}