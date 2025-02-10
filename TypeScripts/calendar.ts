//Credit to this turotial: https://dev.to/wizdomtek/creating-a-dynamic-calendar-using-html-css-and-javascript-29m

const calendarDates = document.querySelector('.calendar-dates') as HTMLDivElement;
const monthYear = document.getElementById('month-year') as HTMLDivElement;
const prevMonthBtn = document.getElementById('prev-month') as HTMLButtonElement;
const nextMonthBtn = document.getElementById('next-month') as HTMLButtonElement;
const monthTotalDisplay = document.getElementById('month-total') as HTMLParagraphElement;

const dayDetailsTable = document.getElementById("detailed-day-data") as HTMLTableElement;
const dayDetailsBody = document.getElementById("day-details-body") as HTMLTableSectionElement;
const dayDetailsHeading = document.getElementById("detailed-day-data-heading") as HTMLHeadingElement;
const noDetailsMessage = document.getElementById("no-details-availible") as HTMLParagraphElement;


const currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

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
    let minuteTotals: number[] = [daysInMonth];
    let monthTotal: number = 0;
    //Add the data in
    if (mainData != null)
        //it needs to loop through everything every date which is kinda inefficient lol
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

        let m = minuteTotals[i];
        if (!isNaN(m) && m > 0)
            day.innerHTML += `<span class=timespan>${formatHoursMinutes(m)}</span>`;


        calendarDates.appendChild(day);
    }

    monthTotalDisplay.innerHTML = `Total for ${months[month]}: <b>${formatHoursMinutes(monthTotal)}</b>`;
}

//Go back a month
prevMonthBtn.addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar(currentMonth, currentYear);
});
//Go forward a month
nextMonthBtn.addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar(currentMonth, currentYear);
});

//Click on a date to get info for all logged timespans on that date
//So much for TypeScript types lol
calendarDates.addEventListener('click', (e: any) => {
    if (e.target.textContent !== '') {
        let date = Number.parseInt(e.target.innerHTML);
        ShowDayDetails(date);
    }
});


let showingDetailsForDay: number | null;
function ShowDayDetails(date: number) {
    showingDetailsForDay = date;

    let timespans = mainData.GetAllSpansForDate(currentYear, currentMonth, date);

    if (timespans != null) {
        dayDetailsTable.style.display = "table";
        noDetailsMessage.style.display = "none";

        dayDetailsHeading.innerHTML = `Details for ${date} ${months[currentMonth]}`

        dayDetailsBody.innerHTML = "";

        for (let i = 0; i < timespans.length; i++) {
            const timespan = timespans[i];

            const rowElement = document.createElement('tr');
            //Start time
            const fromElement = document.createElement('td');
            fromElement.innerHTML = formatAMPM(timespan.start);
            rowElement.appendChild(fromElement);
            //End time
            const toElement = document.createElement('td');
            toElement.innerHTML = formatAMPM(timespan.end);
            rowElement.appendChild(toElement);
            //Total Hours, Minutes
            const durationElement = document.createElement('td');
            durationElement.innerHTML = formatHoursMinutes(timespan.GetMinutes());
            rowElement.appendChild(durationElement);

            const managementActionsElement = document.createElement('td');
            //Change times
            const editElement = document.createElement("button");
            editElement.className = "management-button edit-button";
            editElement.addEventListener("click", function () {
                alert("Not implemented.");
            });
            managementActionsElement.appendChild(editElement);

            //Delete
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
    } else {
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
