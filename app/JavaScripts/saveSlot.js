"use strict";class SaveSlot{constructor(t){this.title=null,this.data=null,this.storageKey=t}GetTitle(){if(null==this.title){const t=this.GetData();null!=t&&(this.title=t.title)}return this.title}GetData(){if(null==this.data){const t=localStorage.getItem(this.storageKey);if(null==t)return null;{let l;try{l=JSON.parse(t)}catch(t){return console.error(t),null}let e=[];for(let t=0;t<l.timestamps.length;t++){let a=l.timestamps[t];a=JSON.stringify(a),e.push(Timespan.FromJSON(a))}this.data=new TimeTrackerData,null!=l.title&&(this.data.title=l.title),null!=e&&(this.data.timespans=e),null!=l.notes&&(this.data.notes=l.notes),null!=l.goal&&(this.data.hourGoal=l.goal)}}return this.data}SaveData(t){this.data=t,localStorage.setItem(this.storageKey,t.Serialize())}Rename(t){this.title=t,this.data=null}ClearCache(){this.title=null,this.data=null}}