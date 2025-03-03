"use strict";
class SaveSlot {
    constructor(key) {
        this.title = null;
        this.data = null;
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
    GetData() {
        if (this.data == null) {
            const stringContent = localStorage.getItem(this.storageKey);
            if (stringContent == null) {
                return null;
            }
            else {
                let parsedJSON;
                try {
                    parsedJSON = JSON.parse(stringContent);
                }
                catch (e) {
                    console.error(e);
                    return null;
                }
                let timestamps = [];
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
    SaveData(data) {
        this.data = data;
        localStorage.setItem(this.storageKey, data.Serialize());
    }
    Rename(newName) {
        this.title = newName;
        this.data = null;
    }
    ClearCache() {
        this.title = null;
        this.data = null;
    }
}
