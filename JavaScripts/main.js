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
const setStopTimeButton = document.getElementById("stop-at");
const setStopTimeContainer = document.getElementById("change-stop-time-container");
const setStopTimeInput = document.getElementById("change-stop-time");
const slotChooserDropdown = document.getElementById("select-save-slot");
const slotChooserParent = document.getElementById("save-slot-group");
const deleteSlotOption = document.getElementById("delete-save-slot");
let currentInterval;
let stopTime;
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
    let currentDate;
    if (stopTime == null) {
        currentDate = new Date();
    }
    else {
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
        startUI.hidden = false;
        stopUI.style.display = "none";
        UpdateStartUI();
    }
    else {
        startUI.hidden = true;
        stopUI.style.display = "flex";
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
    let now = new Date();
    if (startDate != null) {
        let endDate;
        if (stopTime == null) {
            endDate = now;
        }
        else {
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
        if (Math.round(elapsedMinutes) >= 1) {
            if (mainData == null) {
                mainData = new TimeTrackerData("", []);
            }
            mainData.Add(new Timespan(startDate, endDate));
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
    setStopTimeButton.style.display = "block";
    setStopTimeContainer.style.display = "none";
    stopTime = null;
    ElapsedTimeDisplay();
}
function StopTimeChanged() {
    stopTime = new Date(setStopTimeInput.value);
    ElapsedTimeDisplay();
}
function BeginTimeChanger(openUI, changeUI, timeInput, date) {
    openUI.style.display = "none";
    changeUI.style.display = "block";
    if (date != null) {
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
function CreateSaveSlotChooserDropdown() {
    slotChooserParent.innerHTML = "";
    for (let i = 0; i < saveSlots.length; i++) {
        const saveSlot = saveSlots[i];
        if (saveSlot == null || saveSlot.length <= 0) {
            continue;
        }
        let label = "Slot " + i;
        let parsedJSON = JSON.parse(saveSlot);
        if (parsedJSON.title != null && parsedJSON.title.length > 0) {
            label = parsedJSON.title;
        }
        const option = document.createElement("option");
        option.innerHTML = label;
        option.title = label;
        option.value = i.toString();
        if (currentSlot == i) {
            option.selected = true;
        }
        slotChooserParent.appendChild(option);
    }
    if (saveSlots.length > 0) {
        deleteSlotOption.disabled = false;
    }
    else {
        deleteSlotOption.disabled = true;
    }
}
function SaveSlotChosen() {
    const v = slotChooserDropdown.value;
    if (v == "create") {
        CreateNewSlot();
    }
    else if (v == "delete") {
        if (saveSlots.length <= 1) {
            alert("Cannot delete. Must have at least one slot.");
        }
        else if (confirm("Delete current save slot?")) {
            DeleteCurrentSave();
        }
    }
    else {
        const n = Number.parseInt(v);
        if (!isNaN(n)) {
            LoadSlot(n);
        }
    }
}
function UpdateCurrentSlotOption() {
    const children = slotChooserParent.childNodes;
    for (let i = 0; i < children.length; i++) {
        const child = children[i];
        if (child.value == currentSlot.toString()) {
            child.innerHTML = "Change";
            child.selected = true;
            child.disabled = true;
        }
        else {
            child.innerHTML = child.title;
            child.selected = false;
            child.disabled = false;
        }
    }
}
InitialLoad();
CreateSaveSlotChooserDropdown();
UpdateCurrentSlotOption();
