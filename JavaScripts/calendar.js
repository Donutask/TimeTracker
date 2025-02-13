"use strict";
const calendarParent = document.getElementById("calendar");
const calendarDates = document.querySelector('.calendar-dates');
const monthYear = document.getElementById('month-year');
const prevMonthBtn = document.getElementById('prev-month');
const nextMonthBtn = document.getElementById('next-month');
const monthTotalDisplay = document.getElementById('month-total');
const dayDetailsTable = document.getElementById("detailed-day-data");
const dayDetailsBody = document.getElementById("day-details-body");
const dayDetailsHeading = document.getElementById("detailed-day-data-heading");
const noDetailsMessage = document.getElementById("no-details-availible");
const noDataMessage = document.getElementById("no-data");
const currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
function renderCalendar(month, year) {
    if (calendarDates == null || monthYear == null) {
        return;
    }
    if (mainData == null || mainData.timespans == null || mainData.timespans.length <= 0) {
        noDataMessage.hidden = false;
        calendarParent.hidden = true;
        monthTotalDisplay.innerHTML = "";
        noDetailsMessage.style.display = "none";
        return;
    }
    else {
        noDataMessage.hidden = true;
        calendarParent.hidden = false;
        noDetailsMessage.style.display = "block";
    }
    calendarDates.innerHTML = '';
    monthYear.textContent = `${months[month]} ${year}`;
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let i = 0; i < firstDay; i++) {
        const blank = document.createElement('div');
        calendarDates.appendChild(blank);
    }
    const today = new Date();
    let minuteTotals = [daysInMonth];
    let monthTotal = 0;
    if (mainData != null)
        for (let j = 0; j < mainData.timespans.length; j++) {
            const element = mainData.timespans[j];
            const start = element.start;
            if (start.year == year && start.month == month) {
                if (isNaN(minuteTotals[start.day])) {
                    minuteTotals[start.day] = 0;
                }
                let m = element.GetMinutes();
                minuteTotals[start.day] += m;
                monthTotal += m;
            }
        }
    for (let i = 1; i <= daysInMonth; i++) {
        const day = document.createElement('div');
        day.className = "calendar-date";
        day.textContent = i.toString();
        if (i === today.getDate() &&
            year === today.getFullYear() &&
            month === today.getMonth()) {
            day.classList.add('current-date');
        }
        let m = minuteTotals[i];
        if (!isNaN(m) && m > 0)
            day.innerHTML += `<span class=timespan>${DateTime.formatHoursMinutes(m)}</span>`;
        calendarDates.appendChild(day);
    }
    monthTotalDisplay.innerHTML = `Total for ${months[month]}: <b>${DateTime.formatHoursMinutes(monthTotal)}</b>`;
}
prevMonthBtn.addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar(currentMonth, currentYear);
});
nextMonthBtn.addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar(currentMonth, currentYear);
});
calendarDates.addEventListener('click', (e) => {
    let content;
    if (e.target.className == "timespan") {
        content = e.target.parentNode.innerHTML;
    }
    else {
        content = e.target.innerHTML;
    }
    if (content != null) {
        let date = Number.parseInt(content);
        ShowDayDetails(date);
    }
});
function UpdateCalendarAndDetails() {
    RenderCurrentCalendar();
    if (showingDetailsForDay != null) {
        ShowDayDetails(showingDetailsForDay);
    }
}
function RenderCurrentCalendar() {
    renderCalendar(currentMonth, currentYear);
}
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
            const rowElement = document.createElement('tr');
            const fromElement = document.createElement('td');
            const fromInput = document.createElement("input");
            fromInput.type = "time";
            fromInput.disabled = true;
            fromInput.value = timespan.start.FormatForTimeInput();
            fromInput.className = "edit-time-input";
            fromInput.id = "edit-time-input-start-" + i;
            fromElement.appendChild(fromInput);
            rowElement.appendChild(fromElement);
            const toElement = document.createElement('td');
            const toInput = document.createElement("input");
            toInput.type = "time";
            toInput.disabled = true;
            toInput.value = timespan.end.FormatForTimeInput();
            toInput.className = "edit-time-input";
            toInput.id = "edit-time-input-end-" + i;
            toElement.appendChild(toInput);
            rowElement.appendChild(toElement);
            const durationElement = document.createElement('td');
            durationElement.id = "duration-" + i;
            durationElement.innerHTML = DateTime.formatHoursMinutes(timespan.GetMinutes());
            rowElement.appendChild(durationElement);
            const managementActionsElement = document.createElement('td');
            const beginManagementActionsContainer = document.createElement("div");
            beginManagementActionsContainer.id = "management-actions-" + i;
            const editElement = document.createElement("button");
            editElement.className = "management-button edit-button";
            editElement.id = "edit-button-" + i;
            editElement.addEventListener("click", function () {
                BeginEdit(i, timespan);
            });
            beginManagementActionsContainer.appendChild(editElement);
            const deleteElement = document.createElement("button");
            deleteElement.className = "management-button delete-button";
            deleteElement.id = "delete-button-" + i;
            deleteElement.addEventListener("click", function () {
                if (timespan.GetMinutes() < 1 || confirm("Delete?")) {
                    mainData.Remove(timespan);
                    UpdateCalendarAndDetails();
                    SaveData();
                }
            });
            beginManagementActionsContainer.appendChild(deleteElement);
            managementActionsElement.appendChild(beginManagementActionsContainer);
            const applyEditButton = document.createElement("button");
            const endEditActionContainer = document.createElement("div");
            applyEditButton.className = "management-button apply-edit-button";
            applyEditButton.id = "apply-edit-button-" + i;
            applyEditButton.style.display = "none";
            endEditActionContainer.appendChild(applyEditButton);
            const cancelEditButton = document.createElement("button");
            cancelEditButton.className = "management-button cancel-edit-button";
            cancelEditButton.id = "cancel-edit-button-" + i;
            cancelEditButton.style.display = "none";
            endEditActionContainer.appendChild(cancelEditButton);
            managementActionsElement.appendChild(endEditActionContainer);
            rowElement.appendChild(managementActionsElement);
            dayDetailsBody.appendChild(rowElement);
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
