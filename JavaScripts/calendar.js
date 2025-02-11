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
            if (start.getFullYear() == year && start.getMonth() == month) {
                if (isNaN(minuteTotals[start.getDate()])) {
                    minuteTotals[start.getDate()] = 0;
                }
                let m = element.GetMinutes();
                minuteTotals[start.getDate()] += m;
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
            day.innerHTML += `<span class=timespan>${formatHoursMinutes(m)}</span>`;
        calendarDates.appendChild(day);
    }
    monthTotalDisplay.innerHTML = `Total for ${months[month]}: <b>${formatHoursMinutes(monthTotal)}</b>`;
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
            fromElement.innerHTML = formatAMPM(timespan.start);
            rowElement.appendChild(fromElement);
            const toElement = document.createElement('td');
            toElement.innerHTML = formatAMPM(timespan.end);
            rowElement.appendChild(toElement);
            const durationElement = document.createElement('td');
            durationElement.innerHTML = formatHoursMinutes(timespan.GetMinutes());
            rowElement.appendChild(durationElement);
            const managementActionsElement = document.createElement('td');
            const editElement = document.createElement("button");
            editElement.className = "management-button edit-button";
            editElement.addEventListener("click", function () {
                alert("Not implemented.");
            });
            managementActionsElement.appendChild(editElement);
            const deleteElement = document.createElement("button");
            deleteElement.className = "management-button delete-button";
            deleteElement.addEventListener("click", function () {
                if (timespan.GetMinutes() < 1 || confirm("Delete?")) {
                    mainData.Remove(timespan);
                    UpdateCalendarAndDetails();
                    SaveData();
                }
            });
            managementActionsElement.appendChild(deleteElement);
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
function UpdateCalendarAndDetails() {
    RenderCurrentCalendar();
    if (showingDetailsForDay != null) {
        ShowDayDetails(showingDetailsForDay);
    }
}
function RenderCurrentCalendar() {
    renderCalendar(currentMonth, currentYear);
}
