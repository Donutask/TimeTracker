// Object that handles saving and loading TimeTrackerData from a storage key string.
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

    //Loads TimeTrackerData from localStorage. If already loaded, will return previously loaded value
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

                this.data = new TimeTrackerData();
                if (parsedJSON.title != null)
                    this.data.title = parsedJSON.title;
                if (timestamps != null)
                    this.data.timespans = timestamps;
                if (parsedJSON.notes != null)
                    this.data.notes = parsedJSON.notes;
            }
        }

        return this.data;
    }

    SaveData(data: TimeTrackerData) {
        this.data = data;
        localStorage.setItem(this.storageKey, data.Serialize());
    }

    Rename(newName: string) {
        this.title = newName;
        this.data = null; //to load correct data after
    }

    // Deletes the title and data stored. Do this when chanign the data
    ClearCache() {
        this.title = null;
        this.data = null;
    }
}