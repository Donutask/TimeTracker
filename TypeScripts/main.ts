const titleDisplay = document.getElementById("title");
const startUI = document.getElementById("start-ui");
const startTime = document.getElementById("start-time");
const startButton = document.getElementById("start-button");

const stopUI = document.getElementById("stop-ui");
const elapsedTime = document.getElementById("elapsed-time");
const startedTime = document.getElementById("started-time");

const startedTimeContainer = document.getElementById("started-time-container");
const changeStartedTimeContainer = document.getElementById("change-start-time-container");
const changeStartedTimeInput: HTMLInputElement = document.getElementById("change-start-time") as HTMLInputElement;

const startDateStorageKey = "startDate";
const dataStorageKey = "timeTrackerData";
let currentInterval: number;

function UpdateStartUI() {
    clearInterval(currentInterval);
    UpdateCurrentTimeDisplay();
    currentInterval = setInterval(UpdateCurrentTimeDisplay, 1000);

    if (mainData != null) {
        titleDisplay!.innerHTML = mainData.title;
    }
}

function UpdateCurrentTimeDisplay() {
    let d = new Date();
    startTime!.innerHTML = formatAMPM(d);
}

function UpdateStopUI() {
    const startDate = GetStartDate();
    const currentDate = new Date();

    if (startDate != null) {
        if (startDate.getDate() == currentDate.getDate()) {
            startedTime!.innerHTML = "Started at " + formatAMPM(startDate);
        } else {
            startedTime!.innerHTML = "Started at " + formatAMPM(startDate) + " on " + startDate.toDateString();
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
        elapsedTime!.innerHTML = formatHoursMinutes(totalMinutes);
    }
}

function ShowCorrectUI() {
    //Title
    if (mainData != null)
        titleDisplay!.innerHTML = mainData.title;

    if (GetStartDate() == null) {
        //Start
        startUI!.hidden = false;
        stopUI!.hidden = true;

        UpdateStartUI();
    } else {
        //Stop
        startUI!.hidden = true;
        stopUI!.hidden = false;

        UpdateStopUI();
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
        localStorage.setItem("startDate", "");
        //ensure it exists
        if (mainData == null) {
            mainData = new TimeTrackerData("", []);
        }
        //save it
        mainData.Add(new Timespan(startDate, new Date(), ""));
        SaveData();

        RenderCurrentCalendar();
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
    startedTimeContainer!.style.display = "none";
    changeStartedTimeContainer!.style.display = "block";

    let startDate = GetStartDate();
    if (startDate != null) {
        //https://stackoverflow.com/a/61082536
        startDate.setMinutes(startDate.getMinutes() - startDate.getTimezoneOffset());
        changeStartedTimeInput.value = startDate.toISOString().slice(0, 16);
    }
}

function SubmitStartTimeChange() {
    let date = new Date(changeStartedTimeInput.value);
    localStorage.setItem("startDate", date.getTime().toString());

    ShowCorrectUI();

    CancelStartTimeChange();
}

function CancelStartTimeChange() {
    startedTimeContainer!.style.display = "block";
    changeStartedTimeContainer!.style.display = "none";
}

function RenameTracker() {
    if (mainData == null) {
        mainData = new TimeTrackerData("", []);
    }
    let response = prompt("Rename", mainData.title);

    if (response != null && response.length > 0) {
        mainData.title = response;
        titleDisplay!.innerHTML = response;
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