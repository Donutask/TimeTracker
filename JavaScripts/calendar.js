"use strict";
const calendarDates = document.querySelector('.calendar-dates');
const monthYear = document.getElementById('month-year');
const prevMonthBtn = document.getElementById('prev-month');
const nextMonthBtn = document.getElementById('next-month');
const monthTotalDisplay = document.getElementById('month-total');
let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();
const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];
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
    let minutes = [daysInMonth];
    let monthTotal = 0;
    if (mainData != null)
        for (let j = 0; j < mainData.timespans.length; j++) {
            const element = mainData.timespans[j];
            const start = element.start;
            if (start.getFullYear() == year && start.getMonth() == month) {
                if (isNaN(minutes[start.getDate()])) {
                    minutes[start.getDate()] = 0;
                }
                let m = element.GetMinutes();
                minutes[start.getDate()] += m;
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
        let m = minutes[i];
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
function RenderCurrentCalendar() {
    renderCalendar(currentMonth, currentYear);
}
