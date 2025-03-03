"use strict";
var mainData;
let currentSlot = 0;
let saveSlots = [];
const startDateStorageKey = "startDate";
const saveSlotStorageKey = "currentSaveSlot";
const dataStorageKey = "timeTrackerData";
function InitialLoad() {
    LoadSlotList();
    let loadSlotIndex = 0;
    const storedSlot = localStorage.getItem(saveSlotStorageKey);
    if (storedSlot != null) {
        const storedSlotNumber = Number.parseInt(storedSlot);
        if (!isNaN(storedSlotNumber)) {
            loadSlotIndex = storedSlotNumber;
        }
    }
    if (loadSlotIndex >= saveSlots.length) {
        loadSlotIndex = saveSlots.length - 1;
    }
    LoadSlot(loadSlotIndex);
}
function LoadSlotList() {
    saveSlots = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key == null)
            continue;
        if (!key.startsWith(dataStorageKey))
            continue;
        saveSlots.push(new SaveSlot(key));
    }
    if (saveSlots.length <= 0) {
        let firstSlot = new SaveSlot(dataStorageKey + "0");
        firstSlot.SaveData(new TimeTrackerData("", []));
        saveSlots.push(firstSlot);
    }
}
function SaveData() {
    if (currentSlot < 0 || currentSlot >= saveSlots.length) {
        console.error("Cannot save, slot index out of bounds!");
        return;
    }
    saveSlots[currentSlot].SaveData(mainData);
    SaveSelectedSlotIndex();
}
function SaveSelectedSlotIndex() {
    localStorage.setItem(saveSlotStorageKey, currentSlot.toString());
}
function LoadSlot(slotIndex) {
    currentSlot = slotIndex;
    SaveSelectedSlotIndex();
    let saveSlot = saveSlots[slotIndex];
    let dataToLoad = null;
    if (saveSlot != null) {
        const saveSlotData = saveSlot.GetData();
        if (saveSlotData != null) {
            dataToLoad = saveSlotData;
        }
    }
    if (dataToLoad == null) {
        console.error("Null data");
        mainData = new TimeTrackerData("", []);
        ShowNullDataUI();
    }
    else {
        mainData = dataToLoad;
        UpdateCalendarAndDetails();
        ShowCorrectUI();
        UpdateNotesField();
    }
    UpdateSelectedSlotIndicator();
}
function CreateNewSlot() {
    let keyIndex = saveSlots.length;
    let keyName = dataStorageKey + keyIndex;
    while (localStorage.getItem(keyName) != null) {
        keyIndex++;
        keyName = dataStorageKey + keyIndex;
    }
    let newSlot = new SaveSlot(keyName);
    newSlot.SaveData(new TimeTrackerData("", []));
    saveSlots.push(newSlot);
    currentSlot = saveSlots.length - 1;
    ShowCorrectUI();
    UpdateCalendarAndDetails();
    UpdateNotesField();
    GenerateSidebarList();
}
function DeleteCurrentSave() {
    saveSlots.splice(currentSlot, 1);
    localStorage.removeItem(dataStorageKey + currentSlot);
    GenerateSidebarList();
    LoadSlot(currentSlot - 1);
}
function Load(stringData) {
    if (stringData != null && stringData.length > 0) {
        let parsedJSON;
        try {
            parsedJSON = JSON.parse(stringData);
        }
        catch (e) {
            console.error(e);
            mainData = new TimeTrackerData("", []);
            return;
        }
        let timestamps = [];
        for (let i = 0; i < parsedJSON.timestamps.length; i++) {
            let element = parsedJSON.timestamps[i];
            element = JSON.stringify(element);
            timestamps.push(Timespan.FromJSON(element));
        }
        mainData = new TimeTrackerData(parsedJSON.title, timestamps);
        if (parsedJSON.notes != null)
            mainData.notes = parsedJSON.notes;
    }
}
function Export() {
    const text = mainData.Serialize();
    let data = new Blob([text], { type: 'text/plain' });
    let fileURL = window.URL.createObjectURL(data);
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
        alert("Success!");
    }
}
