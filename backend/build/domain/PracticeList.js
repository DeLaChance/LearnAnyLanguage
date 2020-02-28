"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PracticeList = /** @class */ (function () {
    function PracticeList(id, translations, source, target) {
        this.id = id;
        this.translations = translations;
        this.source = source;
        this.target = target;
    }
    PracticeList.prototype.getID = function () {
        return this.id;
    };
    return PracticeList;
}());
exports.PracticeList = PracticeList;
