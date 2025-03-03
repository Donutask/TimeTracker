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
    sidebarList.textContent = "";
    saveSlotElements = [];
    if (saveSlots == null || saveSlots.length <= 0) {
        return;
    }
    for (let i = 0; i < saveSlots.length; i++) {
        const slot = saveSlots[i];
        if (slot != null) {
            let label = "Slot " + i;
            const slotTitle = slot.GetTitle();
            if (slotTitle != null && slotTitle.length > 0) {
                label = slotTitle;
            }
            const element = document.createElement("li");
            const button = document.createElement("button");
            button.className = "save-slot-button";
            if (label == "CLEAR CACHE") {
                button.addEventListener("click", function () { ClearCache(); alert("Cleared cache."); });
            }
            button.addEventListener("click", () => LoadSlot(i));
            button.textContent = label;
            element.appendChild(button);
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
function DeleteCurrentSlot() {
    if (confirm("Are you sure you want to delete the current save slot?")) {
        DeleteCurrentSave();
    }
}
CloseSidebar();
