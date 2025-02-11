//Refrences to HTML elements
const titleDisplay = document.getElementById("title") as HTMLTitleElement;
const startUI = document.getElementById("start-ui") as HTMLElement;
const startTime = document.getElementById("start-time") as HTMLElement;
const startButton = document.getElementById("start-button") as HTMLElement;

const stopUI = document.getElementById("stop-ui") as HTMLElement;
const elapsedTime = document.getElementById("elapsed-time") as HTMLElement;
const startedTime = document.getElementById("started-time") as HTMLElement;

const startedTimeContainer = document.getElementById("started-time-container") as HTMLElement;
const changeStartedTimeContainer = document.getElementById("change-start-time-container") as HTMLElement;
const changeStartedTimeInput: HTMLInputElement = document.getElementById("change-start-time") as HTMLInputElement;

const setStopTimeButton = document.getElementById("stop-at") as HTMLElement;
const setStopTimeContainer = document.getElementById("change-stop-time-container") as HTMLElement;
const setStopTimeInput: HTMLInputElement = document.getElementById("change-stop-time") as HTMLInputElement;

const slotChooserDropdown = document.getElementById("select-save-slot") as HTMLSelectElement;
const slotChooserParent = document.getElementById("save-slot-group") as HTMLElement;
const deleteSlotOption = document.getElementById("delete-save-slot") as HTMLOptionElement;
const createSlotOption = document.getElementById("create-save-slot") as HTMLOptionElement;

let currentInterval: number;
let stopTime: DateTime | null;
let startDate: DateTime ;

function UpdateStartUI() {
    clearInterval(currentInterval);
    UpdateCurrentTimeDisplay();
    currentInterval = setInterval(UpdateCurrentTimeDisplay, 1000);
}

function UpdateCurrentTimeDisplay() {
    startTime.innerHTML = DateTime.formatAMPM(DateTime.Now());
}

function UpdateStopUI() {
    const currentDate = DateTime.Now();

    if (startDate != null) {
        if (DateTime.IsSameDate(startDate, currentDate)) {
            startedTime.innerHTML = "Started at " + DateTime.formatAMPM(startDate);
        } else {
            startedTime.innerHTML = "Started at " + DateTime.formatAMPM(startDate) + " on " + startDate.ToDateString();
        }

        clearInterval(currentInterval);
        ElapsedTimeDisplay();
        currentInterval = setInterval(ElapsedTimeDisplay, 1000);
    }
}

function ElapsedTimeDisplay() {
    let currentDate: DateTime;
    if (stopTime == null) {
        currentDate = DateTime.Now();
    } else {
        currentDate = stopTime;
    }

    if (!DateTime.IsNull( startDate)) {
        const totalMinutes = DateTime.DifferenceInMinutes(startDate, currentDate);
        elapsedTime.innerHTML = DateTime.formatHoursMinutes(totalMinutes);
    }
}

function ShowCorrectUI() {
    ShowTitle();

    if (DateTime.IsNull( startDate )) {
        //Start
        startUI.hidden = false;
        stopUI.style.display = "none";

        UpdateStartUI();
    } else {
        //Stop
        startUI.hidden = true;
        stopUI.style.display = "flex";

        UpdateStopUI();
    }
}

function ShowTitle() {
    //Title
    if (mainData != null && mainData.title != null && mainData.title.length > 0) {
        titleDisplay.innerHTML = mainData.title;
    } else {
        titleDisplay.innerHTML = "Time Tracker";
    }
}

//Clicking the start button should
//store the start time
function StartTimer() {
    let d = DateTime.Now();
    startDate = d;
    localStorage.setItem("startDate", d.ToString());

    ShowCorrectUI();
}

function StopTimer() {
    let now = DateTime.Now();

    if (!DateTime.IsNull(startDate )) {

        let endDate: DateTime;
        if (stopTime == null) {
            endDate = now;
        } else {
            endDate = stopTime;

            if (DateTime.DifferenceInMinutes(startDate, endDate) < 0) {
                alert("Error: End time is before start time.");
                return;
            }
            if (DateTime.DifferenceInMinutes(startDate, endDate) >= 24) {
                if (!confirm("Elapsed time is greater than 24 hours, continue?")) {
                    return;
                }
            }
        }

        //Time must have actually passed
        let elapsedMinutes = DateTime.DifferenceInMinutes(startDate, endDate);
        if (Math.round(elapsedMinutes) >= 1) {
            //ensure it exists
            if (mainData == null) {
                mainData = new TimeTrackerData("", []);
            }
            //save it
            mainData.Add(new Timespan(startDate, endDate));
            SaveData();

            UpdateCalendarAndDetails();
        }

        startDate = DateTime.NullDate();
        localStorage.setItem("startDate", "");
    } else {
        console.error("Start date is null");
    }

    ShowCorrectUI();
}

//Loads the date the timer was started. Null if doesn't exist.
function LoadStartDate() {
    let dateString = localStorage.getItem(startDateStorageKey);
    if(dateString != null){
    startDate =    DateTime.FromString(dateString);
    }else{
        startDate==DateTime.NullDate();
    }
}


//Change when the timer was started (because you forgot or something)
function BeginChangeStartedTime() {
    if (DateTime.IsNull(startDate ) ) {
        BeginTimeChanger(startedTimeContainer, changeStartedTimeContainer, changeStartedTimeInput, null);
    } else {
        BeginTimeChanger(startedTimeContainer, changeStartedTimeContainer, changeStartedTimeInput, startDate.ToJsDate());
    }
}

function SubmitStartTimeChange() {
    let date = new Date(changeStartedTimeInput.value);
    startDate = DateTime.FromJsDate(date);
    localStorage.setItem("startDate", startDate.ToString());

    ShowCorrectUI();

    CancelStartTimeChange();
}

function CancelStartTimeChange() {
    startedTimeContainer.style.display = "block";
    changeStartedTimeContainer.style.display = "none";
}

function BeginSetStopTime() {
    BeginTimeChanger(setStopTimeButton, setStopTimeContainer, setStopTimeInput, new Date());
    stopTime = DateTime.Now();
}
function CancelSetStopTime() {
    setStopTimeButton.style.display = "block"
    setStopTimeContainer.style.display = "none";
    stopTime = null;
    ElapsedTimeDisplay();
}
function StopTimeChanged() {
    stopTime = DateTime.FromJsDate(new Date(setStopTimeInput.value));
    ElapsedTimeDisplay();
}

function BeginTimeChanger(openUI: HTMLElement, changeUI: HTMLElement, timeInput: HTMLInputElement, date: Date | null) {
    openUI.style.display = "none";
    changeUI.style.display = "block";

    if (date != null) {
        //https://stackoverflow.com/a/61082536
        date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
        timeInput.value = date.toISOString().slice(0, 16);
    }
}

//Ask for new name, then show that title and save
function RenameTracker() {
    if (mainData == null) {
        mainData = new TimeTrackerData("", []);
    }
    let response = prompt("Rename", mainData.title);

    if (response != null && response.length > 0) {
        mainData.title = response;
        ShowTitle();
        SaveData();
    }
}

//Resets and makes select options for dropdown to choose which save slot to use.
function CreateSaveSlotChooserDropdown() {
    slotChooserParent.innerHTML = "";

    for (let i = 0; i < saveSlots.length; i++) {
        const saveSlot = saveSlots[i];
        if (saveSlot == null || saveSlot.length <= 0) {
            continue;
        }

        let label = "Slot " + i;
        //Custom name by reading JSON title property, if it exists
        try {
            let parsedJSON = JSON.parse(saveSlot);
            if (parsedJSON.title != null && parsedJSON.title.length > 0) {
                label = parsedJSON.title;
            }
        } catch (error) {
            console.error(error);
        }

        //Create HTML element
        const option = document.createElement("option") as HTMLOptionElement;
        option.innerHTML = label;
        option.title = label;
        option.value = i.toString();

        if (currentSlot == i) {
            option.selected = true;
        }
        slotChooserParent.appendChild(option);
    }

    //Can only delete if you have more than 1 slot
    if (saveSlots.length > 0) {
        deleteSlotOption.disabled = false;
    } else {
        deleteSlotOption.disabled = true;
    }
}

function SaveSlotChosen() {
    const v = slotChooserDropdown.value;

    if (v == "create") {
        CreateNewSlot();
    }
    //Delete after confirmation
    else if (v == "delete") {
        if (saveSlots.length <= 1) {
            alert("Cannot delete. Must have at least one slot.");
        } else if (confirm("Delete current save slot?")) {
            DeleteCurrentSave();
        }
        //putting the delete option in a drop down was kinda silly
        deleteSlotOption.selected = false;
        createSlotOption.selected = false;
    }
    //Load selected slot index
    else {
        const n = Number.parseInt(v);
        if (!isNaN(n)) {
            LoadSlot(n);
        }
    }
}

//Show the option to select the currently selected save slot as "Change", to avoid duplicating the title in the dropdown
function UpdateCurrentSlotOption() {
    const children = slotChooserParent.childNodes;
    for (let i = 0; i < children.length; i++) {
        const child = children[i] as HTMLOptionElement;

        if (child.value == currentSlot.toString()) {
            child.innerHTML = "Change";
            child.selected = true;
            child.disabled = true;
        } else {
            child.innerHTML = child.title;
            child.selected = false;
            child.disabled = false;
        }
    }
}

//When page loads:
LoadStartDate();
InitialLoad();
CreateSaveSlotChooserDropdown();
UpdateCurrentSlotOption();