if(!self.define){let e,i={};const c=(c,s)=>(c=new URL(c+".js",s).href,i[c]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=c,e.onload=i,document.head.appendChild(e)}else e=c,importScripts(c),i()})).then((()=>{let e=i[c];if(!e)throw new Error(`Module ${c} didn’t register its module`);return e})));self.define=(s,a)=>{const r=e||("document"in self?document.currentScript.src:"")||location.href;if(i[r])return;let n={};const f=e=>c(e,r),d={module:{uri:r},exports:n,require:f};i[r]=Promise.all(s.map((e=>d[e]||f(e)))).then((e=>(a(...e),n)))}}define(["./workbox-1a38833a"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"favicon.ico",revision:"e3daa5fa500c1bb1559b5805722303af"},{url:"Icons/check-circle-fill.svg",revision:"35dc22843b2d26f9971eeb58c2c38128"},{url:"Icons/Credit.txt",revision:"5c21a7f78356fc05b3ff19a5e5d52d55"},{url:"Icons/menu-black.svg",revision:"b899d0369ad447bac7d63ec1c365b0f1"},{url:"Icons/menu-white.svg",revision:"ff974d9a04befd2c160bcdb1f3926967"},{url:"Icons/pencil-fill.svg",revision:"ab9888157fb1ca923b629b0e46df0c68"},{url:"Icons/trash-fill.svg",revision:"8c821996383e7ce8bed143c5c8a8ec01"},{url:"Icons/x-circle-fill.svg",revision:"62ea36a89b64ec4e0f68824da5450730"},{url:"index.html",revision:"4265a64d148254c8261cc27503ca86c2"},{url:"JavaScripts/calendar.js",revision:"7d774253284bd2710a916cf8f579b38b"},{url:"JavaScripts/dataManagement.js",revision:"014e44369c2586b338b9241a7f78b22c"},{url:"JavaScripts/dateTime.js",revision:"163a2742fe2606260f823f46b7271b59"},{url:"JavaScripts/dayDetailsTable.js",revision:"85d92d93f7ff23aa9811477c63c85c23"},{url:"JavaScripts/debug.js",revision:"46be58d1560716b4a2d7275fed93e943"},{url:"JavaScripts/main.js",revision:"dd9ab26fa967a6b53575cae89478f3ba"},{url:"JavaScripts/saveSlot.js",revision:"d4b6f9d7fc4469f6135cd63d890aeea8"},{url:"JavaScripts/sidebar.js",revision:"1f6cd668789e5fc3b2ebd0d8033fa2b3"},{url:"JavaScripts/timespan.js",revision:"7ef57917bdf5592a5b02ed1b688820ac"},{url:"JavaScripts/timeTrackerData.js",revision:"cafa7c3ca5c97c32ed7decc6da6b1892"},{url:"Stylesheets/colours.css",revision:"df2926f6a72531f8fae3f19fd280cd61"},{url:"Stylesheets/main.css",revision:"9a9e22a99e9233bb96737c5005719e72"}],{ignoreURLParametersMatching:[/^utm_/,/^fbclid$/]})}));
//# sourceMappingURL=sw.js.map
