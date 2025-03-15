//This script manages saving, loading, importing, and exporting
var mainData: TimeTrackerData;
let currentSlot: number = 0;

let saveSlots: SaveSlot[] = [];

const startDateStorageKey = "startDate"; //todo: change so that each slot stores different start date
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
    //Make sure it actually loads one of the slots
    if (loadSlotIndex >= saveSlots.length) {
        loadSlotIndex = saveSlots.length - 1;
    }

    LoadSlot(loadSlotIndex);
}

//New algorithm gets all local storage keys and filters to find ones that could be valid save slots.
function LoadSlotList() {
    saveSlots = [];

    //Get all keys from localStroage
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);

        //Must exist and be a valid data storage key
        if (key == null) continue;
        if (!key.startsWith(dataStorageKey)) continue;

        //Simply add key to list. The class handles the rest
        saveSlots.push(new SaveSlot(key));
    }

    //Ensure there is always one slot
    if (saveSlots.length <= 0) {
        let firstSlot = new SaveSlot(dataStorageKey + "0");
        firstSlot.SaveData(new TimeTrackerData());
        saveSlots.push(firstSlot);
    }
}

//Serialises data, writes to save slot array and to local storage. Also writes current slot index to local storage.
function SaveData() {
    if (currentSlot < 0 || currentSlot >= saveSlots.length) {
        console.error("Cannot save, slot index out of bounds!");
        return;
    }
    saveSlots[currentSlot].SaveData(mainData);
    SaveSelectedSlotIndex();
}

//Just writes the slot
function SaveSelectedSlotIndex() {
    localStorage.setItem(saveSlotStorageKey, currentSlot.toString());
}

//Loads the save slot from local storage, applies, and updates UI.
function LoadSlot(slotIndex: number) {
    currentSlot = slotIndex;
    SaveSelectedSlotIndex();

    //Get data from the save slot
    let saveSlot = saveSlots[slotIndex];

    let dataToLoad: TimeTrackerData | null = null; //data will default to null, then be replaced if exists.
    if (saveSlot != null) {
        const saveSlotData = saveSlot.GetData();
        if (saveSlotData != null) {
            dataToLoad = saveSlotData;
        }
    }

    if (dataToLoad == null) {
        console.error("Attempting to load null data");
        mainData = new TimeTrackerData(); //data will default to null, then be replaced if exists.

        ShowNullDataUI();
    } else {
        mainData = dataToLoad;
        //Update everything
        UpdateGoalButton();
        UpdateCalendarAndDetails();
        ShowCorrectUI();
        UpdateNotesField();
    }

    UpdateSelectedSlotIndicator();
}

//Creates empty save slot and updates UI
function CreateNewSlot() {
    //Ensure unique key name
    let keyIndex = saveSlots.length;
    let keyName = dataStorageKey + keyIndex;
    while (localStorage.getItem(keyName) != null) {
        keyIndex++;
        keyName = dataStorageKey + keyIndex;
    }

    //Create slot object
    let newSlot = new SaveSlot(keyName);
    newSlot.SaveData(new TimeTrackerData());
    //Add to list
    saveSlots.push(newSlot);
    //Since it is last added, it should be the length-1
    currentSlot = saveSlots.length - 1;

    //Update everything
    ShowCorrectUI();
    UpdateCalendarAndDetails();
    UpdateNotesField();
    GenerateSidebarList();
}

//Deletes save slot from list, local storage
//Loads the slot before it
function DeleteCurrentSave() {

    saveSlots.splice(currentSlot, 1);
    localStorage.removeItem(dataStorageKey + currentSlot);

    GenerateSidebarList();
    LoadSlot(currentSlot - 1);
}

//Replaced with SaveSlot.Load
//Deserailises data
// function Load(stringData: string) {
//     if (stringData != null && stringData.length > 0) {
//         let parsedJSON;
//         try {
//             parsedJSON = JSON.parse(stringData);
//         } catch (e) {
//             //If can't parse, set the data as default.
//             console.error(e);
//             mainData = new TimeTrackerData("", []);
//             return;
//         }

//         //deserialise timestamps
//         let timestamps: Timespan[] = [];
//         for (let i = 0; i < parsedJSON.timestamps.length; i++) {
//             let element = parsedJSON.timestamps[i];
//             element = JSON.stringify(element);
//             timestamps.push(Timespan.FromJSON(element));
//         }

//         mainData = new TimeTrackerData(parsedJSON.title, timestamps);
//         if (parsedJSON.notes != null)
//             mainData.notes = parsedJSON.notes;
//     }
// }

//These are unused and need to be updated with new slot system
//Credit: https://stackoverflow.com/a/21016088
// function Export() {
//     const text = mainData.Serialize();

//     //Make save data into file URL
//     let data = new Blob([text], { type: 'text/plain' });
//     let fileURL = window.URL.createObjectURL(data);
 
//     //add url to a link element and click the link
//     let link = document.createElement('a');
//     link.setAttribute('download', 'time-tracker-export.txt');
//     link.href = fileURL;
//     document.body.appendChild(link);

//     // wait for the link to be added to the document
//     window.requestAnimationFrame(function () {
//         let event = new MouseEvent('click');
//         link.dispatchEvent(event);
//         document.body.removeChild(link);
//     });
// }

// //Asks user to paste the file contents, then loads it
// function Import() {
//     let text = prompt("Paste Exported Data");

//     if (text != null && text.length > 0) {
        
//         Load(text);
//         ShowCorrectUI();
//         UpdateCalendarAndDetails();
//         alert("Success!");
//     }
// }