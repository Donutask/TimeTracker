"use strict";
var mainData;
const titleDisplay = document.getElementById("title");
const startUI = document.getElementById("start-ui");
const startTime = document.getElementById("start-time");
const startButton = document.getElementById("start-button");
const stopUI = document.getElementById("stop-ui");
const elapsedTime = document.getElementById("elapsed-time");
const startedTime = document.getElementById("started-time");
const startDateStorageKey = "startDate";
const dataStorageKey = "timeTrackerData";
let currentInterval;
function UpdateStartUI() {
    clearInterval(currentInterval);
    UpdateCurrentTimeDisplay();
    currentInterval = setInterval(UpdateCurrentTimeDisplay, 1000);
    if (mainData != null) {
        titleDisplay.innerHTML = mainData.title;
    }
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
    if (mainData != null)
        titleDisplay.innerHTML = mainData.title;
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
function StartTimer() {
    let d = new Date();
    localStorage.setItem("startDate", d.getTime().toString());
    console.log("Started timer!");
    ShowCorrectUI();
}
function StopTimer() {
    let startDate = GetStartDate();
    if (startDate != null) {
        localStorage.setItem("startDate", "");
        mainData.Add(new Timespan(startDate, new Date(), ""));
        SaveData();
        RenderCurrentCalendar();
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
function RenameTracker() {
    if (mainData == null) {
        mainData = new TimeTrackerData("", []);
    }
    let response = prompt("Rename", mainData.title);
    if (response != null && response.length > 0) {
        mainData.title = response;
        titleDisplay.innerHTML = response;
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
function SaveData() {
    localStorage.setItem(dataStorageKey, mainData.Serialize());
}
function LoadData() {
    let stringData = localStorage.getItem(dataStorageKey);
    if (stringData != null) {
        let parsedJSON = JSON.parse(stringData);
        let timestamps = [];
        for (let i = 0; i < parsedJSON.timestamps.length; i++) {
            let element = parsedJSON.timestamps[i];
            element = JSON.stringify(element);
            console.log(element);
            timestamps.push(Timespan.FromJSON(element));
        }
        mainData = new TimeTrackerData(parsedJSON.title, timestamps);
    }
}
LoadData();
RenderCurrentCalendar();
ShowCorrectUI();
