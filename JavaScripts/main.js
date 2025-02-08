"use strict";
const titleDisplay = document.getElementById("title");
const startUI = document.getElementById("start-ui");
const startTime = document.getElementById("start-time");
const startButton = document.getElementById("start-button");
const stopUI = document.getElementById("stop-ui");
const elapsedTime = document.getElementById("elapsed-time");
const startedTime = document.getElementById("started-time");
const startedTimeContainer = document.getElementById("started-time-container");
const changeStartedTimeContainer = document.getElementById("change-start-time-container");
const changeStartedTimeInput = document.getElementById("change-start-time");
const startDateStorageKey = "startDate";
const dataStorageKey = "timeTrackerData";
let currentInterval;
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
        }
        else {
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
        startUI.hidden = false;
        stopUI.hidden = true;
        UpdateStartUI();
    }
    else {
        startUI.hidden = true;
        stopUI.hidden = false;
        UpdateStopUI();
    }
}
function ShowTitle() {
    if (mainData != null && mainData.title != null && mainData.title.length > 0) {
        titleDisplay.innerHTML = mainData.title;
    }
    else {
        titleDisplay.innerHTML = "Time Tracker";
    }
}
function StartTimer() {
    let d = new Date();
    localStorage.setItem("startDate", d.getTime().toString());
    ShowCorrectUI();
}
function StopTimer() {
    let startDate = GetStartDate();
    if (startDate != null) {
        let elapsedMinutes = dateDiffInMinutes(startDate, new Date());
        console.log(elapsedMinutes);
        if (elapsedMinutes >= 1) {
            if (mainData == null) {
                mainData = new TimeTrackerData("", []);
            }
            mainData.Add(new Timespan(startDate, new Date(), ""));
            SaveData();
            UpdateCalendarAndDetails();
        }
        localStorage.setItem("startDate", "");
    }
    else {
        console.error("Start date is null");
    }
    ShowCorrectUI();
}
function GetStartDate() {
    let dateString = localStorage.getItem(startDateStorageKey);
    if (dateString == null || dateString == "") {
        return null;
    }
    else {
        let ticks = Number.parseInt(dateString);
        if (Number.isNaN(ticks)) {
            return null;
        }
        else {
            return new Date(ticks);
        }
    }
}
function BeginChangeStartedTime() {
    startedTimeContainer.style.display = "none";
    changeStartedTimeContainer.style.display = "block";
    let startDate = GetStartDate();
    if (startDate != null) {
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
    startedTimeContainer.style.display = "block";
    changeStartedTimeContainer.style.display = "none";
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
    let times = [];
    for (let i = 0; i < 100; i++) {
        let start = randomDate(new Date(2025, 0, 1), new Date());
        let end = new Date(start.getTime() + (Math.random() * 60 * 60 * 1000));
        times.push(new Timespan(start, end, ""));
    }
    mainData = new TimeTrackerData("Test Data", times);
}
LoadData();
RenderCurrentCalendar();
ShowCorrectUI();
