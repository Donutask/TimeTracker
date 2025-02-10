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

let currentInterval: number;
let stopTime: Date | null;
// let startDate: Date | null;

function UpdateStartUI() {
    clearInterval(currentInterval);
    UpdateCurrentTimeDisplay();
    currentInterval = setInterval(UpdateCurrentTimeDisplay, 1000);
}

function UpdateCurrentTimeDisplay() {
    let d = new Date();
    startTime.innerHTML = formatAMPM(d);
}

function UpdateStopUI() {
    const startDate = GetStartDate();
    const currentDate = new Date();

    if (startDate != null) {
        if (startDate.getDate() == currentDate.getDate()) {
            startedTime.innerHTML = "Started at " + formatAMPM(startDate);
        } else {
            startedTime.innerHTML = "Started at " + formatAMPM(startDate) + " on " + startDate.toDateString();
        }

        clearInterval(currentInterval);
        ElapsedTimeDisplay();
        currentInterval = setInterval(ElapsedTimeDisplay, 1000);
    }
}

function ElapsedTimeDisplay() {
    const startDate = GetStartDate();
    let currentDate: Date;
    if (stopTime == null) {
        currentDate = new Date();
    } else {
        currentDate = stopTime;
    }

    if (startDate != null) {
        const totalMinutes = dateDiffInMinutes(startDate, currentDate);
        elapsedTime.innerHTML = formatHoursMinutes(totalMinutes);
    }
}

function ShowCorrectUI() {
    ShowTitle();

    if (GetStartDate() == null) {
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
    let d = new Date();
    localStorage.setItem("startDate", d.getTime().toString());

    ShowCorrectUI();
}

function StopTimer() {
    let startDate = GetStartDate();
    let now = new Date();

    if (startDate != null) {

        let endDate: Date;
        if (stopTime == null) {
            endDate = now;
        } else {
            endDate = stopTime;

            if (dateDiffInHours(startDate, endDate) < 0) {
                alert("Error: End time is before start time.");
                return;
            }
            if (dateDiffInHours(startDate, endDate) >= 24) {
                if (!confirm("Elapsed time is greater than 24 hours, continue?")) {
                    return;
                }
            }
        }

        let elapsedMinutes = dateDiffInMinutes(startDate, endDate);

        if (elapsedMinutes >= 1) {
            //ensure it exists
            if (mainData == null) {
                mainData = new TimeTrackerData("", []);
            }
            //save it
            mainData.Add(new Timespan(startDate, endDate));
            SaveData();

            UpdateCalendarAndDetails();
        }
        localStorage.setItem("startDate", "");
    } else {
        console.error("Start date is null");
    }

    ShowCorrectUI();
}

//Loads the date the timer was started. Null if doesn't exist.
function GetStartDate(): Date | null {
    let dateString = localStorage.getItem(startDateStorageKey);

    if (dateString == null || dateString == "") {
        return null;
    } else {
        let ticks = Number.parseInt(dateString);
        if (Number.isNaN(ticks)) {
            return null;
        } else {
            return new Date(ticks);
        }
    }
}


//Change when the timer was started (because you forgot or something)
function BeginChangeStartedTime() {
    BeginTimeChanger(startedTimeContainer, changeStartedTimeContainer, changeStartedTimeInput, GetStartDate());
}

function SubmitStartTimeChange() {
    let date = new Date(changeStartedTimeInput.value);
    localStorage.setItem("startDate", date.getTime().toString());

    ShowCorrectUI();

    CancelStartTimeChange();
}

function CancelStartTimeChange() {
    startedTimeContainer.style.display = "block";
    changeStartedTimeContainer.style.display = "none";
}

function BeginSetStopTime() {
    BeginTimeChanger(setStopTimeButton, setStopTimeContainer, setStopTimeInput, new Date());
    stopTime = new Date();
}
function CancelSetStopTime() {
    setStopTimeButton.style.display = "block"
    setStopTimeContainer.style.display = "none";
    stopTime = null;
    ElapsedTimeDisplay();
}
function StopTimeChanged() {
    stopTime = new Date(setStopTimeInput.value);
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

        let label = "Slot " + i;
        //Custom name by reading JSON title property, if it exists
        if (saveSlot != null) {
            let parsedJSON = JSON.parse(saveSlot);
            if (parsedJSON.title != null && parsedJSON.title.length > 0) {
                label = parsedJSON.title;
            }
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
}

function SaveSlotChosen() {
    const v = slotChooserDropdown.value;

    if (v == "create") {
        CreateNewSlot();
    } else if (v == "delete") {
        if (confirm("Delete current save slot?")) {
            DeleteCurrentSave();
        }
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

InitialLoad();
CreateSaveSlotChooserDropdown();
UpdateCurrentSlotOption();