"use strict";var mainData;let currentSlot=0,saveSlots=[];const startDateStorageKey="startDate",saveSlotStorageKey="currentSaveSlot",dataStorageKey="timeTrackerData";function InitialLoad(){LoadSlotList();let t=0;const e=localStorage.getItem(saveSlotStorageKey);if(null!=e){const a=Number.parseInt(e);isNaN(a)||(t=a)}t>=saveSlots.length&&(t=saveSlots.length-1),LoadSlot(t)}function LoadSlotList(){saveSlots=[];for(let t=0;t<localStorage.length;t++){const e=localStorage.key(t);null!=e&&(e.startsWith(dataStorageKey)&&saveSlots.push(new SaveSlot(e)))}if(saveSlots.length<=0){let t=new SaveSlot(dataStorageKey+"0");t.SaveData(new TimeTrackerData),saveSlots.push(t)}}function SaveData(){currentSlot<0||currentSlot>=saveSlots.length?console.error("Cannot save, slot index out of bounds!"):(saveSlots[currentSlot].SaveData(mainData),SaveSelectedSlotIndex())}function SaveSelectedSlotIndex(){localStorage.setItem(saveSlotStorageKey,currentSlot.toString())}function LoadSlot(t){currentSlot=t,SaveSelectedSlotIndex();let e=saveSlots[t],a=null;if(null!=e){const t=e.GetData();null!=t&&(a=t)}null==a?(console.error("Attempting to load null data"),mainData=new TimeTrackerData,ShowNullDataUI()):(mainData=a,UpdateGoalButton(),UpdateCalendarAndDetails(),ShowCorrectUI(),UpdateNotesField()),UpdateSelectedSlotIndicator()}function CreateNewSlot(){let t=saveSlots.length,e=dataStorageKey+t;for(;null!=localStorage.getItem(e);)t++,e=dataStorageKey+t;let a=new SaveSlot(e);a.SaveData(new TimeTrackerData),saveSlots.push(a),currentSlot=saveSlots.length-1,ShowCorrectUI(),UpdateCalendarAndDetails(),UpdateNotesField(),GenerateSidebarList()}function DeleteCurrentSave(){saveSlots.splice(currentSlot,1),localStorage.removeItem(dataStorageKey+currentSlot),GenerateSidebarList(),LoadSlot(currentSlot-1)}