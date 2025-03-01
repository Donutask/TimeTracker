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

//Get all save slots from local storage.
//Ensures at least 1 valid slot exists.
function LoadSlots() {
    let arrayLength = 1;
    if (localStorage.length > 2) {
        // Array index for each slot. The startDate and slot number is seperate storage entry, so subtract 2
        arrayLength = localStorage.length - 2;
    }
    saveSlots = new Array(arrayLength);

    //Legacy behaviour (they had no numbers before)
    const noSuffix = localStorage.getItem(dataStorageKey);
    if (noSuffix != null) {
        saveSlots[0] = noSuffix;
        localStorage.setItem(dataStorageKey + "0", noSuffix);
        localStorage.removeItem(dataStorageKey);
    }

    let validSaveSlots = 0;
    //if item with key exists, add save slot
    for (let i = 0; i < localStorage.length; i++) {
        const item = localStorage.getItem(dataStorageKey + i);

        if (item != null && item.length > 1) {
            saveSlots[i] = item;
            validSaveSlots++;
        } else {
            saveSlots[i] = "";
        }
    }

    //Ensure a slot exists by creating empty data if null
    if (validSaveSlots <= 0) {
        mainData = new TimeTrackerData("", []);
        saveSlots[0] = mainData.Serialize();
        currentSlot = 0;
        SaveData();
    }
}

//Serialises data, writes to save slot array and to local storage. Also writes current slot index to local storage.
function SaveData() {
    const serialised = mainData.Serialize();
    saveSlots[currentSlot] = serialised;
    localStorage.setItem(dataStorageKey + currentSlot, serialised);
    localStorage.setItem(saveSlotStorageKey, currentSlot.toString());
}

//Loads the save slot from local storage, applies, and updates UI.
function LoadSlot(slotIndex: number) {
    currentSlot = slotIndex;

    let stringData = saveSlots[slotIndex];
    if (stringData != null) {
        Load(stringData);
        UpdateCalendarAndDetails();
        ShowCorrectUI();
        UpdateNotesField();
        UpdateSelectedSlotIndicator();
    } else {
        console.error("No data for slot " + slotIndex);
    }
}

//Creates empty save slot and updates UI
function CreateNewSlot() {
    mainData = new TimeTrackerData("", []);
    currentSlot = saveSlots.length;
    SaveAndUpdate();
    LoadSlots();
    GenerateSidebarList();
}

//Deletes and loads 0th slot
function DeleteCurrentSave() {
    localStorage.removeItem(dataStorageKey + currentSlot);
    LoadSlots();
    LoadSlot(0);
    GenerateSidebarList();
}

//Deserailises data
function Load(stringData: string) {
    if (stringData != null && stringData.length > 0) {
        let parsedJSON;
        try {
            parsedJSON = JSON.parse(stringData);
        } catch (e) {
            //If can't parse, set the data as default.
            console.error(e);
            mainData = new TimeTrackerData("", []);
            return;
        }

        //deserialise timestamps
        let timestamps: Timespan[] = [];
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

//Credit: https://stackoverflow.com/a/21016088
function Export() {
    const text = mainData.Serialize();

    //Make save data into file URL
    let data = new Blob([text], { type: 'text/plain' });
    let fileURL = window.URL.createObjectURL(data);

    //add url to a link element and click the link
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

//Asks user to paste the file contents, then loads it
function Import() {
    let text = prompt("Paste Exported Data");

    if (text != null && text.length > 0) {
        Load(text);
        SaveAndUpdate();
        alert("Success!");
    }
}

//Saves, shows start/stop screen, updates calendar and date details.
function SaveAndUpdate() {
    SaveData();
    ShowCorrectUI();
    UpdateCalendarAndDetails();
}