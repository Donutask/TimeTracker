"use strict";
const calendarDates = document.querySelector('.calendar-dates');
const monthYear = document.getElementById('month-year');
const prevMonthBtn = document.getElementById('prev-month');
const nextMonthBtn = document.getElementById('next-month');
const monthTotalDisplay = document.getElementById('month-total');
const dayDetailsTable = document.getElementById("detailed-day-data");
const dayDetailsBody = document.getElementById("day-details-body");
const dayDetailsHeading = document.getElementById("detailed-day-data-heading");
const noDetailsMessage = document.getElementById("no-details-availible");
const currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
function renderCalendar(month, year) {
    if (calendarDates == null || monthYear == null) {
        return;
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
    if (e.target.textContent !== '') {
        let date = Number.parseInt(e.target.innerHTML);
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
            const deleteElement = document.createElement("button");
            deleteElement.className = "delete-button";
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
        noDetailsMessage.style.display = "block";
        dayDetailsHeading.innerHTML = "";
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
