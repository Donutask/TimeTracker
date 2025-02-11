"use strict";
var mainData;
let currentSlot = 0;
let saveSlots = [];
const startDateStorageKey = "startDate";
const saveSlotStorageKey = "currentSaveSlot";
const dataStorageKey = "timeTrackerData";
function InitialLoad() {
    LoadSlots();
    let loadSlotIndex = 0;
    const storedSlot = localStorage.getItem(saveSlotStorageKey);
    if (storedSlot != null) {
        const storedSlotNumber = Number.parseInt(storedSlot);
        if (!isNaN(storedSlotNumber)) {
            loadSlotIndex = storedSlotNumber;
        }
    }
    LoadSlot(loadSlotIndex);
}
function LoadSlots() {
    let arrayLength = 1;
    if (localStorage.length > 2) {
        arrayLength = localStorage.length - 2;
    }
    saveSlots = new Array(arrayLength);
    const noSuffix = localStorage.getItem(dataStorageKey);
    if (noSuffix != null) {
        saveSlots[0] = noSuffix;
        localStorage.setItem(dataStorageKey + "0", noSuffix);
        localStorage.removeItem(dataStorageKey);
    }
    let validSaveSlots = 0;
    for (let i = 0; i < localStorage.length; i++) {
        const item = localStorage.getItem(dataStorageKey + i);
        if (item != null && item.length > 1) {
            saveSlots[i] = item;
            validSaveSlots++;
        }
        else {
            saveSlots[i] = "";
        }
    }
    if (validSaveSlots <= 0) {
        mainData = new TimeTrackerData("", []);
        saveSlots[0] = mainData.Serialize();
        currentSlot = 0;
        SaveData();
    }
}
function SaveData() {
    const serialised = mainData.Serialize();
    saveSlots[currentSlot] = serialised;
    localStorage.setItem(dataStorageKey + currentSlot, serialised);
    localStorage.setItem(saveSlotStorageKey, currentSlot.toString());
}
function LoadSlot(slotIndex) {
    currentSlot = slotIndex;
    let stringData = saveSlots[slotIndex];
    if (stringData != null) {
        Load(stringData);
        UpdateCalendarAndDetails();
        ShowCorrectUI();
        UpdateCurrentSlotOption();
    }
    else {
        console.error("No data for slot " + slotIndex);
    }
}
function CreateNewSlot() {
    mainData = new TimeTrackerData("", []);
    currentSlot = saveSlots.length;
    SaveAndUpdate();
    LoadSlots();
    CreateSaveSlotChooserDropdown();
    console.log("Made slot");
}
function DeleteCurrentSave() {
    localStorage.removeItem(dataStorageKey + currentSlot);
    LoadSlots();
    LoadSlot(0);
    CreateSaveSlotChooserDropdown();
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
        SaveAndUpdate();
        alert("Success!");
    }
}
function Clear() {
    if (confirm("This will delete all data. Are you sure?")) {
        mainData = new TimeTrackerData("", []);
        SaveAndUpdate();
    }
}
function SaveAndUpdate() {
    SaveData();
    ShowCorrectUI();
    UpdateCalendarAndDetails();
}
