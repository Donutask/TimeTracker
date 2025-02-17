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
const createSlotOption = document.getElementById("create-save-slot");
const noteInput = document.getElementById("notes-input");
let currentInterval;
let stopTime = null;
let startDate;
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
        }
        else {
            startedTime.innerHTML = "Started at " + DateTime.formatAMPM(startDate) + " on " + startDate.ToDateString();
        }
        clearInterval(currentInterval);
        ElapsedTimeDisplay();
        currentInterval = setInterval(ElapsedTimeDisplay, 1000);
    }
}
function ElapsedTimeDisplay() {
    let currentDate;
    if (stopTime == null) {
        currentDate = DateTime.Now();
    }
    else {
        currentDate = stopTime;
    }
    if (!DateTime.IsNull(startDate)) {
        const totalMinutes = DateTime.DifferenceInMinutes(startDate, currentDate);
        elapsedTime.innerHTML = DateTime.formatHoursMinutes(totalMinutes);
        if (totalMinutes < 0) {
            elapsedTime.classList.add("invalid-time");
        }
        else {
            elapsedTime.classList.remove("invalid-time");
        }
    }
}
function ShowCorrectUI() {
    ShowTitle();
    if (DateTime.IsNull(startDate)) {
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
    let d = DateTime.Now();
    startDate = d;
    localStorage.setItem("startDate", d.ToString());
    ShowCorrectUI();
}
function StopTimer() {
    let now = DateTime.Now();
    if (!DateTime.IsNull(startDate)) {
        let endDate;
        if (stopTime == null) {
            endDate = now;
        }
        else {
            endDate = stopTime;
            if (DateTime.DifferenceInMinutes(startDate, endDate) < 0) {
                alert("Error: End time is before start time.");
                return;
            }
            if (DateTime.DifferenceInMinutes(startDate, endDate) >= (24 * 60)) {
                if (!confirm("Elapsed time is greater than 24 hours, continue?")) {
                    return;
                }
            }
        }
        let elapsedMinutes = DateTime.DifferenceInMinutes(startDate, endDate);
        if (Math.round(elapsedMinutes) >= 1) {
            if (mainData == null) {
                mainData = new TimeTrackerData("", []);
            }
            mainData.Add(new Timespan(startDate, endDate));
            SaveData();
            UpdateCalendarAndDetails();
        }
        startDate = DateTime.NullDate();
        localStorage.setItem("startDate", "");
    }
    else {
        console.error("Start date is null");
    }
    ShowCorrectUI();
}
function LoadStartDate() {
    let dateString = localStorage.getItem(startDateStorageKey);
    if (dateString != null) {
        startDate = DateTime.FromString(dateString);
    }
    else {
        startDate == DateTime.NullDate();
    }
}
function BeginChangeStartedTime() {
    BeginTimeChanger(startedTimeContainer, changeStartedTimeContainer, changeStartedTimeInput, startDate);
}
function SubmitStartTimeChange() {
    startDate.ChangeHoursMinutesFromTimeInputString(changeStartedTimeInput.value);
    localStorage.setItem("startDate", startDate.ToString());
    ShowCorrectUI();
    CancelStartTimeChange();
}
function CancelStartTimeChange() {
    startedTimeContainer.style.display = "block";
    changeStartedTimeContainer.style.display = "none";
}
function BeginSetStopTime() {
    const now = DateTime.Now();
    BeginTimeChanger(setStopTimeButton, setStopTimeContainer, setStopTimeInput, now);
    stopTime = now;
}
function CancelSetStopTime() {
    setStopTimeButton.style.display = "block";
    setStopTimeContainer.style.display = "none";
    stopTime = null;
    ElapsedTimeDisplay();
}
function StopTimeChanged() {
    if (DateTime.IsNull(stopTime)) {
        stopTime = DateTime.Now();
        stopTime.ChangeHoursMinutesFromTimeInputString(setStopTimeInput.value);
    }
    else {
        stopTime.ChangeHoursMinutesFromTimeInputString(setStopTimeInput.value);
    }
    ElapsedTimeDisplay();
}
function BeginTimeChanger(hide, show, timeInput, date) {
    hide.style.display = "none";
    show.style.display = "block";
    if (date != null && !DateTime.IsNull(date)) {
        timeInput.value = date.FormatForTimeInput();
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
        try {
            let parsedJSON = JSON.parse(saveSlot);
            if (parsedJSON.title != null && parsedJSON.title.length > 0) {
                label = parsedJSON.title;
            }
        }
        catch (error) {
            console.error(error);
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
        deleteSlotOption.selected = false;
        createSlotOption.selected = false;
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
function NoteInputChanged() {
    mainData.notes = noteInput.value;
    SaveData();
}
function UpdateNotesField() {
    noteInput.value = mainData.notes;
}
LoadStartDate();
InitialLoad();
CreateSaveSlotChooserDropdown();
UpdateCurrentSlotOption();
