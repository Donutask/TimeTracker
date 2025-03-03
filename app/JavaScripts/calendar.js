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
let previouslySelectedDate;
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
function renderCalendar(month, year) {
    if (calendarDates == null || monthYear == null) {
        return;
    }
    calendarDates.textContent = '';
    monthYear.textContent = `${months[month]} ${year}`;
    const firstDay = new Date(year, month, 1).getDay() - 1;
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
        day.dataset.date = i.toString();
        if (i === today.getDate() && year === today.getFullYear() && month === today.getMonth()) {
            day.classList.add('current-date');
            const circle = document.createElement("div");
            circle.className = "current-date-circle";
            circle.textContent = i.toString();
            day.appendChild(circle);
        }
        else {
            day.textContent = i.toString();
        }
        if (i == showingDetailsForDay) {
            day.classList.add("selected-date");
            previouslySelectedDate = day;
        }
        const m = minuteTotals[i];
        if (!isNaN(m) && m != 0) {
            day.innerHTML += `<span class="timespan${m > 0 ? "" : " invalid-time"}">${DateTime.formatHoursMinutes(m)}</span>`;
        }
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
    ShowNoDetails();
});
nextMonthBtn.addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar(currentMonth, currentYear);
    ShowNoDetails();
});
calendarDates.addEventListener('click', (e) => {
    var _a;
    if (e.target.id == "calendar-dates") {
        ShowNoDetails();
        return;
    }
    let target = e.target;
    while (!((_a = target.classList) === null || _a === void 0 ? void 0 : _a.contains("calendar-date"))) {
        if (target.parentNode == null) {
            return;
        }
        target = target.parentNode;
    }
    if (previouslySelectedDate != null) {
        previouslySelectedDate.classList.remove("selected-date");
    }
    target.classList.add("selected-date");
    previouslySelectedDate = target;
    const dateString = target.dataset.date;
    if (dateString != null) {
        let date = Number.parseInt(dateString);
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
