"use strict";
const cacheName = 'cache-v3';
const precacheResources = ['index.html',
    'style.css',
    'JavaScripts/calendar.js',
    'JavaScripts/dataManagement.js',
    'JavaScripts/dateUtils.js',
    'JavaScripts/main.js',
    'JavaScripts/timespan.js',
    'JavaScripts/timeTrackerData.js'
];
self.addEventListener('install', (event) => {
    event.waitUntil(caches.open(cacheName).then((cache) => cache.addAll(precacheResources)));
});
self.addEventListener('activate', (event) => {
});
self.addEventListener('fetch', (event) => {
    event.respondWith(caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
            return cachedResponse;
        }
        return fetch(event.request);
    }));
});
