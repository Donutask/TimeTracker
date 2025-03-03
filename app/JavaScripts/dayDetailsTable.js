"use strict";
const dayDetailsHeading = document.getElementById("detailed-day-data-heading");
const noDetailsMessage = document.getElementById("no-details-availible");
const noDateSelectedMessage = document.getElementById("no-date-selected");
const addTimeButton = document.getElementById("add-button");
const addTimeDialog = document.getElementById("add-time-modal");
const addTimeForm = document.getElementById("add-time-form");
const addTimeStartInput = document.getElementById("add-time-input-start");
const addTimeEndInput = document.getElementById("add-time-input-end");
const addTimeDurationDisplay = document.getElementById("add-time-duration");
const dayDetailsBody = document.getElementById("day-details-body");
const dayDetailsTable = document.getElementById("detailed-day-data");
const dayDetailRowTemplate = document.getElementById("day-details-template");
let showingDetailsForDay;
function ShowDayDetails(date) {
    showingDetailsForDay = date;
    noDateSelectedMessage.style.display = "none";
    addTimeButton.style.display = "inline";
    dayDetailsHeading.textContent = `Details for ${date} ${months[currentMonth]}`;
    let timespans = mainData.GetAllSpansForDate(currentYear, currentMonth, date);
    if (timespans != null) {
        dayDetailsTable.style.display = "table";
        noDetailsMessage.style.display = "none";
        dayDetailsBody.textContent = "";
        for (let i = 0; i < timespans.length; i++) {
            const timespan = timespans[i];
            const rowTemplateClone = dayDetailRowTemplate.content.cloneNode(true);
            const fromInput = rowTemplateClone.querySelector("#edit-time-input-start");
            fromInput.id = "edit-time-input-start-" + i;
            fromInput.value = timespan.start.FormatForTimeInput();
            const toInput = rowTemplateClone.querySelector("#edit-time-input-end");
            toInput.value = timespan.end.FormatForTimeInput();
            toInput.id = "edit-time-input-end-" + i;
            const durationElement = rowTemplateClone.querySelector("#duration");
            durationElement.id = "duration-" + i;
            const durationMinutes = timespan.GetMinutes();
            durationElement.textContent = DateTime.formatHoursMinutes(durationMinutes);
            if (durationMinutes <= 0) {
                durationElement.classList.add("invalid-time");
            }
            const editElement = rowTemplateClone.querySelector("#edit-button");
            editElement.id = "edit-button-" + i;
            editElement.addEventListener("click", function () {
                BeginEdit(i, timespan);
            });
            const deleteElement = rowTemplateClone.querySelector("#delete-button");
            deleteElement.id = "delete-button-" + i;
            deleteElement.addEventListener("click", function () {
                if (durationMinutes < 1 || confirm("Delete?")) {
                    mainData.Remove(timespan);
                    UpdateCalendarAndDetails();
                    SaveData();
                }
            });
            const applyEditButton = rowTemplateClone.querySelector("#apply-edit-button");
            applyEditButton.id = "apply-edit-button-" + i;
            const cancelEditButton = rowTemplateClone.querySelector("#cancel-edit-button");
            cancelEditButton.id = "cancel-edit-button-" + i;
            const managementActionsContainer = rowTemplateClone.querySelector("#management-actions");
            managementActionsContainer.id = "management-actions-" + i;
            dayDetailsBody.appendChild(rowTemplateClone);
        }
    }
    else {
        dayDetailsTable.style.display = "none";
        if (mainData == null || mainData.timespans == null || mainData.timespans.length <= 0) {
        }
        else {
            noDetailsMessage.style.display = "block";
        }
    }
}
function ShowNoDetails() {
    noDetailsMessage.style.display = "none";
    noDateSelectedMessage.style.display = "block";
    addTimeButton.style.display = "none";
    dayDetailsTable.style.display = "none";
    dayDetailsHeading.textContent = "";
    showingDetailsForDay = null;
}
function BeginEdit(index, timespan) {
    const start = document.getElementById("edit-time-input-start-" + index);
    const end = document.getElementById("edit-time-input-end-" + index);
    const duration = document.getElementById("duration-" + index);
    const cancel = document.getElementById("cancel-edit-button-" + index);
    const apply = document.getElementById("apply-edit-button-" + index);
    const actions = document.getElementById("management-actions-" + index);
    if (start == null || end == null || cancel == null || apply == null || actions == null) {
        console.log("Something is null");
        return;
    }
    start.disabled = false;
    end.disabled = false;
    cancel.style.display = "inline";
    apply.style.display = "inline";
    cancel.addEventListener("click", function () {
        CancelEdit(index, timespan);
    });
    apply.addEventListener("click", function () {
        ApplyEdit(index, timespan);
    });
    start.addEventListener("input", function () {
        OnTimeInputShowNewDuration(start, end, duration, timespan);
    });
    end.addEventListener("input", function () {
        OnTimeInputShowNewDuration(start, end, duration, timespan);
    });
    actions.style.display = "none";
}
function OnTimeInputShowNewDuration(start, end, duration, timespan) {
    let newStart = timespan.start.Clone();
    let newEnd = timespan.end.Clone();
    newStart.ChangeHoursMinutesFromTimeInputString(start.value);
    newEnd.ChangeHoursMinutesFromTimeInputString(end.value);
    let difference = DateTime.DifferenceInMinutes(newStart, newEnd);
    duration.textContent = DateTime.formatHoursMinutes(difference);
    if (difference <= 0) {
        duration.classList.add("invalid-time");
    }
    else {
        duration.classList.remove("invalid-time");
    }
}
function ApplyEdit(index, timespan) {
    const start = document.getElementById("edit-time-input-start-" + index);
    const end = document.getElementById("edit-time-input-end-" + index);
    let newStart = timespan.start.Clone();
    let newEnd = timespan.end.Clone();
    newStart.ChangeHoursMinutesFromTimeInputString(start.value);
    newEnd.ChangeHoursMinutesFromTimeInputString(end.value);
    const difference = DateTime.DifferenceInMinutes(newStart, newEnd);
    if (difference == 0) {
        alert("Start and end times cannot be the same.");
        return;
    }
    else if (difference < 0) {
        alert("Duration cannot be negative.");
        return;
    }
    timespan.start = newStart;
    timespan.end = newEnd;
    SaveData();
    EndEdit(index);
    RenderCurrentCalendar();
    noDetailsMessage.textContent = "";
}
function CancelEdit(index, timespan) {
    const start = document.getElementById("edit-time-input-start-" + index);
    const end = document.getElementById("edit-time-input-end-" + index);
    const duration = document.getElementById("duration-" + index);
    start.value = timespan.start.FormatForTimeInput();
    end.value = timespan.end.FormatForTimeInput();
    const minutes = timespan.GetMinutes();
    duration.textContent = DateTime.formatHoursMinutes(minutes);
    if (minutes <= 0) {
        duration.classList.add("invalid-time");
    }
    else {
        duration.classList.remove("invalid-time");
    }
    EndEdit(index);
}
function EndEdit(index) {
    const start = document.getElementById("edit-time-input-start-" + index);
    const end = document.getElementById("edit-time-input-end-" + index);
    const actions = document.getElementById("management-actions-" + index);
    const cancel = document.getElementById("cancel-edit-button-" + index);
    const apply = document.getElementById("apply-edit-button-" + index);
    start.disabled = true;
    end.disabled = true;
    cancel.style.display = "none";
    apply.style.display = "none";
    actions.style.display = "block";
}
let addTimeStart = DateTime.NullDate();
let addTimeEnd = DateTime.NullDate();
function BeginAddTime() {
    if (showingDetailsForDay == null) {
        throw "Cannot add time, no day selected";
    }
    addTimeStart = new DateTime(currentYear, currentMonth, showingDetailsForDay, 0, 0);
    addTimeEnd = new DateTime(currentYear, currentMonth, showingDetailsForDay, 0, 0);
    addTimeStartInput.value = "";
    addTimeEndInput.value = "";
    addTimeDurationDisplay.textContent = "";
    addTimeDialog.showModal();
    document.body.classList.add("stop-scroll");
}
function SubmitAddTime(event) {
    event.preventDefault();
    mainData.Add(new Timespan(addTimeStart, addTimeEnd));
    SaveData();
    UpdateCalendarAndDetails();
    CloseAddTime();
}
function CloseAddTime() {
    addTimeDialog.close();
    document.body.classList.remove("stop-scroll");
}
function UpdateAddTimeDuration() {
    addTimeStart.ChangeHoursMinutesFromTimeInputString(addTimeStartInput.value);
    addTimeEnd.ChangeHoursMinutesFromTimeInputString(addTimeEndInput.value);
    if (addTimeStartInput.value != "" && addTimeEndInput.value != "") {
        const duration = new Timespan(addTimeStart, addTimeEnd).GetMinutes();
        addTimeDurationDisplay.innerHTML = `Duration: <b class=${duration > 0 ? "" : "invalid-time"}>${DateTime.formatHoursMinutes(duration)}</b>`;
        if (duration == 0) {
            addTimeStartInput.setCustomValidity("Start and end time cannot be the same.");
        }
        else if (duration < 0) {
            addTimeStartInput.setCustomValidity("Start time must be before end time.");
        }
        else {
            addTimeStartInput.setCustomValidity("");
        }
    }
}
addTimeForm.addEventListener("submit", SubmitAddTime);
addTimeStartInput.addEventListener("change", UpdateAddTimeDuration);
addTimeEndInput.addEventListener("change", UpdateAddTimeDuration);
ShowNoDetails();
