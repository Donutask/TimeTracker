//https://dev.to/wizdomtek/creating-a-dynamic-calendar-using-html-css-and-javascript-29m

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

function renderCalendar(month: number, year: number) {
    if (calendarDates == null || monthYear == null) {
        return;
    }

    calendarDates.innerHTML = '';
    monthYear.textContent = `${months[month]} ${year}`;

    // Get the first day of the month
    const firstDay = new Date(year, month, 1).getDay();

    // Get the number of days in the month
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Create blanks for days of the week before the first day
    for (let i = 0; i < firstDay; i++) {
        const blank = document.createElement('div');
        calendarDates.appendChild(blank);
    }

    // Get today's date
    const today = new Date();

    //Calculate total time for each day
    let minutes: number[] = [daysInMonth];
    let monthTotal: number = 0;
    //Add the data in
    if (mainData != null)
        //it needs to loop through everything every date which is kinda inefficient lol
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

    // Populate the days
    for (let i = 1; i <= daysInMonth; i++) {
        const day = document.createElement('div');
        day.className = "calendar-date";
        day.textContent = i.toString();

        // Highlight today's date
        if (
            i === today.getDate() &&
            year === today.getFullYear() &&
            month === today.getMonth()
        ) {
            day.classList.add('current-date');
        }

        let m = minutes[i];
        if (!isNaN(m) && m > 0)
            day.innerHTML += `<span class=timespan>${formatHoursMinutes(m)}</span>`;


        calendarDates.appendChild(day);
    }

    monthTotalDisplay!.innerHTML = `Total for ${months[month]}: <b>${formatHoursMinutes(monthTotal)}</b>`;
}

prevMonthBtn!.addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar(currentMonth, currentYear);
});

nextMonthBtn!.addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar(currentMonth, currentYear);
});

// calendarDates!.addEventListener('click', (e) => {
//     if (e != null && e.target != null e.target.textContent !== '') {
//     alert(`You clicked on ${e.target.textContent} ${months[currentMonth]} ${currentYear}`);
// }
// });

function RenderCurrentCalendar() {
    renderCalendar(currentMonth, currentYear);
}
