"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const developmentMode = true;
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let reg;
            if (developmentMode) {
                reg = yield navigator.serviceWorker.register('JavaScripts/service-worker.js', {
                    type: 'module',
                });
            }
            else {
                reg = yield navigator.serviceWorker.register('JavaScripts/service-worker.js');
            }
        }
        catch (err) {
            console.log('😥 Service worker registration failed: ', err);
        }
    }));
}
