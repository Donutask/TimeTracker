const dayDetailsHeading = document.getElementById("detailed-day-data-heading") as HTMLHeadingElement;
const noDetailsMessage = document.getElementById("no-details-availible") as HTMLParagraphElement;
const noDateSelectedMessage = document.getElementById("no-date-selected") as HTMLParagraphElement;

const addTimeButton = document.getElementById("add-button") as HTMLButtonElement;
const addTimeDialog = document.getElementById("add-time-modal") as HTMLDialogElement;
const addTimeForm = document.getElementById("add-time-form") as HTMLFormElement;
const addTimeStartInput = document.getElementById("add-time-input-start") as HTMLInputElement;
const addTimeEndInput = document.getElementById("add-time-input-end") as HTMLInputElement;
const addTimeDurationDisplay = document.getElementById("add-time-duration") as HTMLElement;

const dayDetailsBody = document.getElementById("day-details-body") as HTMLTableSectionElement;
const dayDetailsTable = document.getElementById("detailed-day-data") as HTMLTableElement;
const dayDetailRowTemplate = document.getElementById("day-details-template") as HTMLTemplateElement;


//Creates a table that displays
// Start | End | Duration | Edit (buttons for deleting the timeslot, or changing the times)
let showingDetailsForDay: number | null;
function ShowDayDetails(date: number) {
    showingDetailsForDay = date;
    noDateSelectedMessage.style.display = "none";
    addTimeButton.style.display = "inline";
    dayDetailsHeading.textContent = `Details for ${date} ${months[currentMonth]}`

    let timespans = mainData.GetAllSpansForDate(currentYear, currentMonth, date);
    if (timespans != null) {
        dayDetailsTable.style.display = "table";
        noDetailsMessage.style.display = "none";

        dayDetailsBody.textContent = "";

        for (let i = 0; i < timespans.length; i++) {
            const timespan = timespans[i];
            const rowTemplateClone = dayDetailRowTemplate.content.cloneNode(true) as HTMLElement;

            const fromInput = rowTemplateClone.querySelector("#edit-time-input-start") as HTMLInputElement;
            fromInput.id = "edit-time-input-start-" + i;
            fromInput.value = timespan.start.FormatForTimeInput();


            const toInput = rowTemplateClone.querySelector("#edit-time-input-end") as HTMLInputElement;
            toInput.value = timespan.end.FormatForTimeInput();
            toInput.id = "edit-time-input-end-" + i;

            const durationElement = rowTemplateClone.querySelector("#duration") as HTMLElement;
            durationElement.id = "duration-" + i;
            durationElement.textContent = DateTime.formatHoursMinutes(timespan.GetMinutes());

            //Change times
            const editElement = rowTemplateClone.querySelector("#edit-button") as HTMLElement;
            editElement.id = "edit-button-" + i;
            editElement.addEventListener("click", function () {
                BeginEdit(i, timespan);
            });

            //Delete
            const deleteElement = rowTemplateClone.querySelector("#delete-button") as HTMLElement;
            deleteElement.id = "delete-button-" + i;
            deleteElement.addEventListener("click", function () {
                if (timespan.GetMinutes() < 1 || confirm("Delete?")) {
                    mainData.Remove(timespan);
                    UpdateCalendarAndDetails();
                    SaveData();
                }
            });

            //Apply or cancel editing the times
            const applyEditButton = rowTemplateClone.querySelector("#apply-edit-button") as HTMLElement;
            applyEditButton.id = "apply-edit-button-" + i;

            const cancelEditButton = rowTemplateClone.querySelector("#cancel-edit-button") as HTMLElement;
            cancelEditButton.id = "cancel-edit-button-" + i;

            const managementActionsContainer = rowTemplateClone.querySelector("#management-actions") as HTMLElement;
            managementActionsContainer.id = "management-actions-" + i;

            dayDetailsBody.appendChild(rowTemplateClone);
        }

    } else {
        dayDetailsTable.style.display = "none";
        // dayDetailsHeading.textContent = "";
        //show this message, only if there are days you could have clicked on
        if (mainData == null || mainData.timespans == null || mainData.timespans.length <= 0) {
        } else {
            noDetailsMessage.style.display = "block";
        }
    }
}

function ShowNoDetails() {
    noDetailsMessage.style.display = "none";
    noDateSelectedMessage.style.display = "block";
    addTimeButton.style.display = "none";
    dayDetailsHeading.textContent = "";
    showingDetailsForDay = null;
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
    duration.textContent = DateTime.formatHoursMinutes(difference);
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
    noDetailsMessage.textContent = "";
}

function CancelEdit(index: number, timespan: Timespan) {
    //Revert all changes
    const start = document.getElementById("edit-time-input-start-" + index) as HTMLInputElement;
    const end = document.getElementById("edit-time-input-end-" + index) as HTMLInputElement;
    const duration = document.getElementById("duration-" + index) as HTMLElement;

    start.value = timespan.start.FormatForTimeInput();
    end.value = timespan.end.FormatForTimeInput();
    duration.textContent = DateTime.formatHoursMinutes(timespan.GetMinutes());

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

//Add time popup

let addTimeStart: DateTime = DateTime.NullDate();
let addTimeEnd: DateTime = DateTime.NullDate();

function BeginAddTime() {
    addTimeDialog.showModal();
    document.body.classList.add("stop-scroll");

    addTimeStart = DateTime.Now();
    addTimeEnd = DateTime.Now();
    addTimeDurationDisplay.textContent = "";
}

//Stop default form behaviour, get & proccess start and end times, add timespan, save, and close
function SubmitAddTime(event: SubmitEvent) {
    event.preventDefault();

    const difference = DateTime.DifferenceInMinutes(addTimeStart, addTimeEnd);
    console.log(difference);


    mainData.Add(new Timespan(addTimeStart, addTimeEnd));
    SaveAndUpdate();

    CloseAddTime();
}

function CloseAddTime() {
    addTimeDialog.close();
    document.body.classList.remove("stop-scroll");
}

//Changes the start and end date variables, calculates duration, and displays it
function UpdateAddTimeDuration() {
    addTimeStart.ChangeHoursMinutesFromTimeInputString(addTimeStartInput.value);
    addTimeEnd.ChangeHoursMinutesFromTimeInputString(addTimeEndInput.value);

    //show duration, if both inputs have a time
    if (addTimeStartInput.value != "" && addTimeEndInput.value != "") {
        const duration = new Timespan(addTimeStart, addTimeEnd).GetMinutes();
        addTimeDurationDisplay.innerHTML = `Duration: <b class=${duration > 0 ? "" : "invalid-time"}>${DateTime.formatHoursMinutes(duration)}</b>`;

        if (duration == 0) {
            addTimeStartInput.setCustomValidity("Start and end time cannot be the same.");
        } else if (duration < 0) {
            addTimeStartInput.setCustomValidity("Start time must be before end time.");
        } else {
            addTimeStartInput.setCustomValidity("");
        }
    }
}

//Add time popup events
addTimeForm.addEventListener("submit", SubmitAddTime);
addTimeStartInput.addEventListener("change", UpdateAddTimeDuration);
addTimeEndInput.addEventListener("change", UpdateAddTimeDuration);

//Default appearance
ShowNoDetails();