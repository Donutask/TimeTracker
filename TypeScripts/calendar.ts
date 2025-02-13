//Credit to this turotial: https://dev.to/wizdomtek/creating-a-dynamic-calendar-using-html-css-and-javascript-29m
const calendarParent = document.getElementById("calendar") as HTMLElement;

const calendarDates = document.querySelector('.calendar-dates') as HTMLDivElement;
const monthYear = document.getElementById('month-year') as HTMLDivElement;
const prevMonthBtn = document.getElementById('prev-month') as HTMLButtonElement;
const nextMonthBtn = document.getElementById('next-month') as HTMLButtonElement;
const monthTotalDisplay = document.getElementById('month-total') as HTMLParagraphElement;

const dayDetailsTable = document.getElementById("detailed-day-data") as HTMLTableElement;
const dayDetailsBody = document.getElementById("day-details-body") as HTMLTableSectionElement;
const dayDetailsHeading = document.getElementById("detailed-day-data-heading") as HTMLHeadingElement;
const noDetailsMessage = document.getElementById("no-details-availible") as HTMLParagraphElement;

const noDataMessage = document.getElementById("no-data") as HTMLParagraphElement;

const currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function renderCalendar(month: number, year: number) {
    if (calendarDates == null || monthYear == null) {
        return;
    }
    //A fresh file has no data, so don't bother rendering anything
    if (mainData == null || mainData.timespans == null || mainData.timespans.length <= 0) {
        noDataMessage.hidden = false;
        calendarParent.hidden = true;
        monthTotalDisplay.innerHTML = "";
        noDetailsMessage.style.display = "none";
        return;
    } else {
        noDataMessage.hidden = true;
        calendarParent.hidden = false;
        noDetailsMessage.style.display = "block";
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
            day.innerHTML += `<span class=timespan>${DateTime.formatHoursMinutes(m)}</span>`;


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
    let content: string;
    if (e.target.className == "timespan") {
        content = e.target.parentNode.innerHTML;
    } else {
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


//Creates a table that displays
// Start | End | Duration | Edit (buttons for deleting the timeslot, or changing the times)
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
            const fromInput = document.createElement("input");
            fromInput.type = "time";
            fromInput.disabled = true;
            fromInput.value = timespan.start.FormatForTimeInput();
            fromInput.className = "edit-time-input";
            fromInput.id = "edit-time-input-start-" + i;
            fromElement.appendChild(fromInput);
            rowElement.appendChild(fromElement);

            //End time
            const toElement = document.createElement('td');
            const toInput = document.createElement("input");
            toInput.type = "time";
            toInput.disabled = true;
            toInput.value = timespan.end.FormatForTimeInput();
            toInput.className = "edit-time-input";
            toInput.id = "edit-time-input-end-" + i;
            toElement.appendChild(toInput);
            rowElement.appendChild(toElement);

            //Total Hours, Minutes
            const durationElement = document.createElement('td');
            durationElement.id = "duration-" + i;
            durationElement.innerHTML = DateTime.formatHoursMinutes(timespan.GetMinutes());
            rowElement.appendChild(durationElement);

            const managementActionsElement = document.createElement('td');
            const beginManagementActionsContainer = document.createElement("div");
            beginManagementActionsContainer.id = "management-actions-" + i;
            //Change times
            const editElement = document.createElement("button");
            editElement.className = "management-button edit-button";
            editElement.id = "edit-button-" + i;
            editElement.addEventListener("click", function () {
                BeginEdit(i, timespan);
            });
            beginManagementActionsContainer.appendChild(editElement);

            //Delete
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

            //Apply or cancel editing the times
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
    } else {
        dayDetailsTable.style.display = "none";
        dayDetailsHeading.innerHTML = "";
        //show this message, only if there are days you could have clicked on
        if (mainData == null || mainData.timespans == null || mainData.timespans.length <= 0) {
        } else {
            noDetailsMessage.style.display = "block";
        }
    }
}

//Start editing the start and end times of a row. This is done by enabling the time inputs
function BeginEdit(index: number, timespan: Timespan) {
    //Get eleemnts
    const start = document.getElementById("edit-time-input-start-" + index) as HTMLInputElement;
    const end = document.getElementById("edit-time-input-end-" + index) as HTMLInputElement;

    const duration = document.getElementById("duration-" + index) as HTMLElement;

    const cancel = document.getElementById("cancel-edit-button-" + index) as HTMLButtonElement;
    const apply = document.getElementById("apply-edit-button-" + index) as HTMLButtonElement;

    const actions = document.getElementById("management-actions-" + index) as HTMLDivElement;
    //Ensure exists
    if (start == null || end == null || cancel == null || apply == null || actions == null) {
        console.log("Something is null");
        return;
    }

    //Show 
    start.disabled = false;
    end.disabled = false;

    cancel.style.display = "inline";
    apply.style.display = "inline";

    //Add listeners
    //Need to make it actually apply. This is hard
    cancel.addEventListener("click", function () {
        CancelEdit(index, timespan);
    });

    apply.addEventListener("click", function () {
        ApplyEdit(index, timespan);
    });

    //Change the duration shown as you edit
    start.addEventListener("input", function () {
        OnTimeInputShowNewDuration(start, end, duration, timespan);
    });

    end.addEventListener("input", function () {
        OnTimeInputShowNewDuration(start, end, duration, timespan);
    });


    //hide previous actions
    actions.style.display = "none";
}

function OnTimeInputShowNewDuration(start: HTMLInputElement, end: HTMLInputElement, duration: HTMLElement, timespan: Timespan) {
    //Clone dates so they dont effect the mainData
    let newStart = timespan.start.Clone();
    let newEnd = timespan.end.Clone();

    //Change the time
    newStart.ChangeHoursMinutesFromTimeInputString(start.value);
    newEnd.ChangeHoursMinutesFromTimeInputString(end.value);

    //Calculate and show duration
    let difference = DateTime.DifferenceInMinutes(newStart, newEnd);
    duration.innerHTML = DateTime.formatHoursMinutes(difference);
}

function ApplyEdit(index: number, timespan: Timespan) {
    //Get elements
    const start = document.getElementById("edit-time-input-start-" + index) as HTMLInputElement;
    const end = document.getElementById("edit-time-input-end-" + index) as HTMLInputElement;

    //Clone dates so they dont effect the mainData (until we want them too)
    let newStart = timespan.start.Clone();
    let newEnd = timespan.end.Clone();

    //Change the time
    newStart.ChangeHoursMinutesFromTimeInputString(start.value);
    newEnd.ChangeHoursMinutesFromTimeInputString(end.value);

    //Prevent invalid durations
    const difference = DateTime.DifferenceInMinutes(newStart, newEnd);
    if (difference == 0) {
        alert("Start and end times cannot be the same.");
        return;
    } else if (difference < 0) {
        alert("Duration cannot be negative.");
        return;
    }

    timespan.start = newStart;
    timespan.end = newEnd;

    SaveData();
    EndEdit(index);

    //Update the calendar view (the details view is fine because it updates as you change)
    RenderCurrentCalendar();
    noDetailsMessage.innerHTML = "";
}

function CancelEdit(index: number, timespan: Timespan) {
    //Revert all changes
    const start = document.getElementById("edit-time-input-start-" + index) as HTMLInputElement;
    const end = document.getElementById("edit-time-input-end-" + index) as HTMLInputElement;
    const duration = document.getElementById("duration-" + index) as HTMLElement;

    start.value = timespan.start.FormatForTimeInput();
    end.value = timespan.end.FormatForTimeInput();
    duration.innerHTML = DateTime.formatHoursMinutes(timespan.GetMinutes());

    EndEdit(index);
}

function EndEdit(index: number) {
    //Get elements
    const start = document.getElementById("edit-time-input-start-" + index) as HTMLInputElement;
    const end = document.getElementById("edit-time-input-end-" + index) as HTMLInputElement;
    const actions = document.getElementById("management-actions-" + index) as HTMLDivElement;
    const cancel = document.getElementById("cancel-edit-button-" + index) as HTMLButtonElement;
    const apply = document.getElementById("apply-edit-button-" + index) as HTMLButtonElement;

    //Hide/show
    start.disabled = true;
    end.disabled = true;
    cancel.style.display = "none";
    apply.style.display = "none";
    actions.style.display = "block";
}

