//This script manages saving, loading, importing, and exporting
var mainData: TimeTrackerData;
let currentSlot: number = 0;

let saveSlots: string[] = [];

const startDateStorageKey = "startDate"; //todo: change so that each slot stores different start date
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
    // Array index for each slot. The startDate and slot number is seperate storage entry, so subtract 2
    saveSlots = new Array(localStorage.length - 2);

    //Legacy behaviour (they had no numbers before)
    const noSuffix = localStorage.getItem(dataStorageKey);
    if (noSuffix != null) {
        saveSlots[0] = noSuffix;
        localStorage.setItem(dataStorageKey + "0", noSuffix);
        localStorage.removeItem(dataStorageKey);
    }

    //if item with key exists, add save slot
    for (let i = 0; i < localStorage.length; i++) {
        const item = localStorage.getItem(dataStorageKey + i);

        if (item != null && item.length > 1) {
            saveSlots[i] = item;
        }
    }
}

//Serialises data, writes to save slot array and to local storage. Also writes current slot index to local storage.
function SaveData() {
    const serialised = mainData.Serialize();
    saveSlots[currentSlot] = serialised;
    localStorage.setItem(dataStorageKey + currentSlot, serialised);
    localStorage.setItem(saveSlotStorageKey, currentSlot.toString());
}

function LoadSlot(slotIndex: number) {
    currentSlot = slotIndex;

    let stringData = saveSlots[slotIndex];
    if (stringData != null) {
        Load(stringData);
        UpdateCalendarAndDetails();
        ShowCorrectUI();
        UpdateCurrentSlotOption();
    } else if (saveSlots.length <= 1) {
        CreateNewSlot();
    } else {
        mainData = new TimeTrackerData("", []);
        SaveAndUpdate();
    }
}

//Creates empty save slot and updates UI
function CreateNewSlot() {
    mainData = new TimeTrackerData("", []);
    currentSlot = saveSlots.length;
    SaveAndUpdate();
    LoadSlots();
    CreateSaveSlotChooserDropdown();

    console.log("Made slot");
}

//Deletes and loads 0th slot
function DeleteCurrentSave() {
    if (saveSlots.length <= 1) {
        alert("Cannot delete. Must have at least one slot.");
        return;
    }

    localStorage.removeItem(dataStorageKey + currentSlot);
    LoadSlots();
    LoadSlot(0);
    CreateSaveSlotChooserDropdown();
}

//Deserailises data
function Load(stringData: string) {
    if (stringData != null) {
        let parsedJSON = JSON.parse(stringData);

        //deserialise timestamps
        let timestamps: Timespan[] = [];
        for (let i = 0; i < parsedJSON.timestamps.length; i++) {
            let element = parsedJSON.timestamps[i];
            element = JSON.stringify(element);
            timestamps.push(Timespan.FromJSON(element));
        }

        mainData = new TimeTrackerData(parsedJSON.title, timestamps);
    }
}

//Credit: https://stackoverflow.com/a/21016088
function Export() {
    const text = mainData.Serialize();

    let fileURL = null;
    let data = new Blob([text], { type: 'text/plain' });

    // If we are replacing a previously generated file we need to
    // manually revoke the object URL to avoid memory leaks.
    if (fileURL !== null) {
        window.URL.revokeObjectURL(fileURL);
    }

    fileURL = window.URL.createObjectURL(data);

    let link = document.createElement('a');
    link.setAttribute('download', 'time-tracker-export.txt');
    link.href = fileURL;
    document.body.appendChild(link);

    // wait for the link to be added to the document
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

//Saves, shows start/stop screen, updates calendar and date details.
function SaveAndUpdate() {
    SaveData();
    ShowCorrectUI();
    UpdateCalendarAndDetails();
}