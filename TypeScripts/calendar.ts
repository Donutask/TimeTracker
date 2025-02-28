//Credit to this turotial: https://dev.to/wizdomtek/creating-a-dynamic-calendar-using-html-css-and-javascript-29m
const calendarParent = document.getElementById("calendar") as HTMLElement;

const calendarDates = document.getElementById('calendar-dates') as HTMLDivElement;
const monthYear = document.getElementById('month-year') as HTMLDivElement;
const prevMonthBtn = document.getElementById('prev-month') as HTMLButtonElement;
const nextMonthBtn = document.getElementById('next-month') as HTMLButtonElement;
const monthTotalDisplay = document.getElementById('month-total') as HTMLParagraphElement;

const currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();
let previouslySelectedDate: HTMLElement;

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function renderCalendar(month: number, year: number) {
    if (calendarDates == null || monthYear == null) {
        return;
    }

    calendarDates.textContent = '';
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
    let minuteTotals: number[] = [daysInMonth];
    let monthTotal: number = 0;
    //Add the data in
    if (mainData != null)
        //it needs to loop through everything every date which is kinda inefficient lol
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

    // Populate the days
    for (let i = 1; i <= daysInMonth; i++) {
        const day = document.createElement('div');
        day.className = "calendar-date";

        //Set custom data- attribute
        day.dataset.date = i.toString();

        // Highlight today's date with circle
        if (i === today.getDate() && year === today.getFullYear() && month === today.getMonth()) {
            day.classList.add('current-date');

            const circle = document.createElement("div");
            circle.className = "current-date-circle";
            circle.textContent = i.toString();
            day.appendChild(circle);
        } else {
            day.textContent = i.toString();
        }

        // Persist selection between refreshes
        if (i == showingDetailsForDay) {
            day.classList.add("selected-date");
            previouslySelectedDate = day;
        }

        const m = minuteTotals[i];
        if (!isNaN(m) && m != 0) {
            //show hh:mm in span. If negative, show in red.
            day.innerHTML += `<span class="timespan${m > 0 ? "" : " invalid-time"}">${DateTime.formatHoursMinutes(m)}</span>`;
        }

        calendarDates.appendChild(day);
    }

    monthTotalDisplay.innerHTML = `Total for ${months[month]}: <b>${DateTime.formatHoursMinutes(monthTotal)}</b>`;
}

//Go back a month
prevMonthBtn.addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar(currentMonth, currentYear);
    ShowNoDetails();
});
//Go forward a month
nextMonthBtn.addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar(currentMonth, currentYear);
    ShowNoDetails();
});

//Click on a date to get info for all logged timespans on that date
//So much for TypeScript types lol
calendarDates.addEventListener('click', (e: any) => {
    //Don't select the element
    if (e.target.id == "calendar-dates") {
        ShowNoDetails();
        return;
    }

    //Sometimes you click on the timespan or current date circle thingy. This finds the parent calendar-date element;
    let target = e.target as HTMLElement;
    while (!target.classList?.contains("calendar-date")) {
        if (target.parentNode == null) {
            return;
        }
        target = target.parentNode as HTMLElement;
    }

    //remove colour indicator
    if (previouslySelectedDate != null) {
        previouslySelectedDate.classList.remove("selected-date");
    }

    //add colour indicator
    target.classList.add("selected-date");
    previouslySelectedDate = target;

    //Parse date from HTML data attribute
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
