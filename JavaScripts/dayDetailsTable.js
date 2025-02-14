"use strict";
const dayDetailsHeading = document.getElementById("detailed-day-data-heading");
const noDetailsMessage = document.getElementById("no-details-availible");
const dayDetailsTable = document.getElementById("detailed-day-data");
const dayDetailsBody = document.getElementById("day-details-body");
const dayDetailRowTemplate = document.getElementById("day-details-template");
let showingDetailsForDay;
function ShowDayDetails(date) {
    showingDetailsForDay = date;
    let timespans = mainData.GetAllSpansForDate(currentYear, currentMonth, date);
    if (timespans != null) {
        dayDetailsTable.style.display = "table";
        noDetailsMessage.style.display = "none";
        dayDetailsHeading.innerHTML = `Details for ${date} ${months[currentMonth]}`;
        dayDetailsBody.innerHTML = "";
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
            durationElement.innerHTML = DateTime.formatHoursMinutes(timespan.GetMinutes());
            const editElement = rowTemplateClone.querySelector("#edit-button");
            editElement.id = "edit-button-" + i;
            editElement.addEventListener("click", function () {
                BeginEdit(i, timespan);
            });
            const deleteElement = rowTemplateClone.querySelector("#delete-button");
            deleteElement.id = "delete-button-" + i;
            deleteElement.addEventListener("click", function () {
                if (timespan.GetMinutes() < 1 || confirm("Delete?")) {
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
        dayDetailsHeading.innerHTML = "";
        if (mainData == null || mainData.timespans == null || mainData.timespans.length <= 0) {
        }
        else {
            noDetailsMessage.style.display = "block";
        }
    }
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
    duration.innerHTML = DateTime.formatHoursMinutes(difference);
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
    noDetailsMessage.innerHTML = "";
}
function CancelEdit(index, timespan) {
    const start = document.getElementById("edit-time-input-start-" + index);
    const end = document.getElementById("edit-time-input-end-" + index);
    const duration = document.getElementById("duration-" + index);
    start.value = timespan.start.FormatForTimeInput();
    end.value = timespan.end.FormatForTimeInput();
    duration.innerHTML = DateTime.formatHoursMinutes(timespan.GetMinutes());
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
