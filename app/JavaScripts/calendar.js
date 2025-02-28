"use strict";
const calendarParent = document.getElementById("calendar");
const calendarDates = document.getElementById('calendar-dates');
const monthYear = document.getElementById('month-year');
const prevMonthBtn = document.getElementById('prev-month');
const nextMonthBtn = document.getElementById('next-month');
const monthTotalDisplay = document.getElementById('month-total');
const currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();
let previouslySelected;
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
function renderCalendar(month, year) {
    if (calendarDates == null || monthYear == null) {
        return;
    }
    calendarDates.textContent = '';
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
        if (i === today.getDate() &&
            year === today.getFullYear() &&
            month === today.getMonth()) {
            day.classList.add('current-date');
            const circle = document.createElement("div");
            circle.className = "current-date-circle";
            circle.textContent = i.toString();
            day.appendChild(circle);
        }
        else {
            day.textContent = i.toString();
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
    if (e.target.id == "calendar-dates") {
        return;
    }
    if (previouslySelected != null) {
        previouslySelected.classList.remove("selected-date");
    }
    let content;
    if (e.target.className == "current-date-circle") {
        content = e.target.textContent;
        previouslySelected = e.target.parentNode;
    }
    if (e.target.className == "timespan") {
        const parent = e.target.parentNode;
        if (parent.className = "current-date") {
            content = parent.querySelector(".current-date-circle").textContent;
        }
        else {
            content = parent.textContent;
        }
        previouslySelected = e.target.parentNode;
    }
    else {
        content = e.target.textContent;
        previouslySelected = e.target;
    }
    previouslySelected.classList.add("selected-date");
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
