"use strict";const calendarParent=document.getElementById("calendar"),calendarDates=document.getElementById("calendar-dates"),monthYear=document.getElementById("month-year"),prevMonthBtn=document.getElementById("prev-month"),nextMonthBtn=document.getElementById("next-month"),monthTotalDisplay=document.getElementById("month-total"),currentDate=new Date;let previouslySelectedDate,currentMonth=currentDate.getMonth(),currentYear=currentDate.getFullYear();const months=["January","February","March","April","May","June","July","August","September","October","November","December"];function renderCalendar(e,t){if(null==calendarDates||null==monthYear)return;calendarDates.textContent="",monthYear.textContent=`${months[e]} ${t}`;const n=new Date(t,e,1).getDay()-1,a=new Date(t,e+1,0).getDate();for(let e=0;e<n;e++){const e=document.createElement("div");calendarDates.appendChild(e)}const r=new Date;let l=[a],o=0;if(null!=mainData)for(let n=0;n<mainData.timespans.length;n++){const a=mainData.timespans[n],r=a.start;if(r.year==t&&r.month==e){isNaN(l[r.day])&&(l[r.day]=0);let e=a.GetMinutes();l[r.day]+=e,o+=e}}for(let n=1;n<=a;n++){const a=document.createElement("div");if(a.className="calendar-date",a.dataset.date=n.toString(),n===r.getDate()&&t===r.getFullYear()&&e===r.getMonth()){a.classList.add("current-date");const e=document.createElement("div");e.className="current-date-circle",e.textContent=n.toString(),a.appendChild(e)}else a.textContent=n.toString();n==showingDetailsForDay&&(a.classList.add("selected-date"),previouslySelectedDate=a);const o=l[n];isNaN(o)||0==o||(a.innerHTML+=`<span class="timespan${o>0?"":" invalid-time"}">${DateTime.formatHoursMinutes(o)}</span>`),calendarDates.appendChild(a)}monthTotalDisplay.innerHTML=`Total for ${months[e]}: <b>${DateTime.formatHoursMinutes(o)}</b>`}function UpdateCalendarAndDetails(){RenderCurrentCalendar(),null!=showingDetailsForDay&&ShowDayDetails(showingDetailsForDay)}function RenderCurrentCalendar(){renderCalendar(currentMonth,currentYear)}prevMonthBtn.addEventListener("click",(()=>{currentMonth--,currentMonth<0&&(currentMonth=11,currentYear--),renderCalendar(currentMonth,currentYear),ShowNoDetails()})),nextMonthBtn.addEventListener("click",(()=>{currentMonth++,currentMonth>11&&(currentMonth=0,currentYear++),renderCalendar(currentMonth,currentYear),ShowNoDetails()})),calendarDates.addEventListener("click",(e=>{var t;if("calendar-dates"==e.target.id)return void ShowNoDetails();let n=e.target;for(;!(null===(t=n.classList)||void 0===t?void 0:t.contains("calendar-date"));){if(null==n.parentNode)return;n=n.parentNode}null!=previouslySelectedDate&&previouslySelectedDate.classList.remove("selected-date"),n.classList.add("selected-date"),previouslySelectedDate=n;const a=n.dataset.date;if(null!=a){let e=Number.parseInt(a);ShowDayDetails(e)}}));