"use strict";
const sidebarElement = document.getElementById("sidebar");
const sidebarButton = document.getElementById("open-sidebar");
const sidebarList = document.getElementById("sidebar-list");
const mainColumn = document.getElementById("center-column-container");
const scrimElement = document.getElementById("scrim");
let isSidebarOpen = false;
let hasSidebarBeenCreated = false;
let saveSlotElements = [];
let previousSaveSlot = -1;
function ToggleSidebar() {
    if (isSidebarOpen) {
        CloseSidebar();
    }
    else {
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
function GenerateSidebarList() {
    sidebarList.innerHTML = "";
    for (let i = 0; i < saveSlots.length; i++) {
        const slot = saveSlots[i];
        if (slot != null && slot.length > 0) {
            let label = "Slot " + i;
            try {
                let parsedJSON = JSON.parse(slot);
                if (parsedJSON.title != null && parsedJSON.title.length > 0) {
                    label = parsedJSON.title;
                }
            }
            catch (error) {
                console.error(error);
            }
            const element = document.createElement("li");
            element.innerHTML = `<button class="save-slot-button" onclick="LoadSlot(${i})">${label}</button>`;
            sidebarList.appendChild(element);
            saveSlotElements.push(element);
        }
        else {
            saveSlotElements.push(null);
        }
    }
    UpdateSelectedSlotIndicator();
}
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
    }
    previousSaveSlot = currentSlot;
}
CloseSidebar();
