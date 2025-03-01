// Manages the list of time trackers on the side
const sidebarElement = document.getElementById("sidebar") as HTMLElement;
const sidebarButton = document.getElementById("open-sidebar") as HTMLButtonElement;
const sidebarList = document.getElementById("sidebar-list") as HTMLUListElement;
const mainColumn = document.getElementById("center-column-container") as HTMLElement;
const scrimElement = document.getElementById("scrim") as HTMLElement;

// const sidebarWidth: number = 150;
// const windowWidthForOverlaySidebar: number = 500;

let isSidebarOpen: boolean = false;
let hasSidebarBeenCreated: boolean = false;
let saveSlotElements: (HTMLElement | null)[] = [];
let previousSaveSlot: number = -1;

function ToggleSidebar() {
    if (isSidebarOpen) {
        CloseSidebar();
    } else {
        OpenSidebar();
    }
}

function OpenSidebar() {
    if (!hasSidebarBeenCreated) {
        GenerateSidebarList();
        hasSidebarBeenCreated = true;
    }
    sidebarElement.style.left = "0px";
    mainColumn.classList.add("main-column-sidebar-offset");
    document.body.classList.add("stop-mobile-scroll");
    scrimElement.hidden = false;

    isSidebarOpen = true;
}

function CloseSidebar() {
    sidebarElement.style.left = "-200px";
    mainColumn.classList.remove("main-column-sidebar-offset");
    document.body.classList.remove("stop-mobile-scroll");
    scrimElement.hidden = true;

    isSidebarOpen = false;
}

//Gets all the save slots and make a link to switch them
function GenerateSidebarList() {
    sidebarList.innerHTML = "";
    saveSlotElements = [];

    if (saveSlots == null || saveSlots.length <= 0) {
        return;
    }
    for (let i = 0; i < saveSlots.length; i++) {
        const slot = saveSlots[i];
        if (slot != null && slot.length > 0) {
            //Try to get the title from the save data
            let label = "Slot " + i;

            try {
                let parsedJSON = JSON.parse(slot);
                if (parsedJSON.title != null && parsedJSON.title.length > 0) {
                    label = parsedJSON.title;
                }
            } catch (error) {
                console.error(error);
            }

            //Add button to the list
            const element = document.createElement("li");
            element.innerHTML = `<button class="save-slot-button" onclick="LoadSlot(${i})">${label}</button>`
            sidebarList.appendChild(element);

            saveSlotElements.push(element);
        } else {
            saveSlotElements.push(null);
        }
    }

    UpdateSelectedSlotIndicator();
}

//Gives class to current savbe slot, and removes class from previous one
function UpdateSelectedSlotIndicator() {
    if (previousSaveSlot >= 0) {
        let prev = saveSlotElements[previousSaveSlot];
        if (prev != null) {
            prev.classList.remove("selected-save-slot");
        }
    }

    let cur = saveSlotElements[currentSlot];
    if (cur != null) {
        cur.classList.add("selected-save-slot");
        console.log(cur);
    }

    previousSaveSlot = currentSlot;
}

function DeleteCurrentSlot() {
    if (confirm("Are you sure you want to delete the current save slot?")) {
        DeleteCurrentSave()
    }
}

CloseSidebar();