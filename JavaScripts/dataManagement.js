"use strict";
var mainData;
function SaveData() {
    localStorage.setItem(dataStorageKey, mainData.Serialize());
}
function LoadData() {
    let stringData = localStorage.getItem(dataStorageKey);
    if (stringData != null)
        Load(stringData);
}
function Load(stringData) {
    if (stringData != null) {
        let parsedJSON = JSON.parse(stringData);
        let timestamps = [];
        for (let i = 0; i < parsedJSON.timestamps.length; i++) {
            let element = parsedJSON.timestamps[i];
            element = JSON.stringify(element);
            timestamps.push(Timespan.FromJSON(element));
        }
        mainData = new TimeTrackerData(parsedJSON.title, timestamps);
    }
}
function Export() {
    const text = mainData.Serialize();
    let fileURL = null;
    let data = new Blob([text], { type: 'text/plain' });
    if (fileURL !== null) {
        window.URL.revokeObjectURL(fileURL);
    }
    fileURL = window.URL.createObjectURL(data);
    let link = document.createElement('a');
    link.setAttribute('download', 'time-tracker-export.txt');
    link.href = fileURL;
    document.body.appendChild(link);
    window.requestAnimationFrame(function () {
        let event = new MouseEvent('click');
        link.dispatchEvent(event);
        document.body.removeChild(link);
    });
}
function Import() {
    let text = prompt("Paste Exported Data");
    if (text != null && text.length > 0) {
        Load(text);
        ShowCorrectUI();
        UpdateCalendarAndDetails();
        SaveData();
        alert("Success!");
    }
}
function Clear() {
    if (confirm("This will delete all data. Are you sure?")) {
        mainData = new TimeTrackerData("", []);
        SaveData();
        ShowCorrectUI();
        UpdateCalendarAndDetails();
    }
}
