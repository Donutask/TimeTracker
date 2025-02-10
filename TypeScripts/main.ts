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

const startDateStorageKey = "startDate";
const dataStorageKey = "timeTrackerData";
let currentInterval: number;
let stopTime: Date | null;

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
    const currentDate = new Date();
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
    if (startDate != null) {
        let endDate: Date;
        if (stopTime == null) {
            endDate = new Date();
        } else {
            endDate = stopTime;
        }

        let elapsedMinutes = dateDiffInMinutes(startDate, endDate);

        if (elapsedMinutes >= 1) {
            //ensure it exists
            if (mainData == null) {
                mainData = new TimeTrackerData("", []);
            }
            //save it
            mainData.Add(new Timespan(startDate, endDate, ""));
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
    setStopTimeButton.hidden = false;
    setStopTimeContainer.hidden = true;
    stopTime = null;
}
function StopTimeChanged() {
    stopTime = new Date(setStopTimeInput.value);
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

function GenerateGibberishData() {
    let times: Timespan[] = [];

    for (let i = 0; i < 100; i++) {
        let start = randomDate(new Date(2025, 0, 1), new Date());
        let end = new Date(start.getTime() + (Math.random() * 60 * 60 * 1000));
        times.push(new Timespan(start, end, ""))
    }

    mainData = new TimeTrackerData("Test Data", times);
}

LoadData();
RenderCurrentCalendar();
ShowCorrectUI();