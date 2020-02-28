"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Word = /** @class */ (function () {
    function Word(id, language, value) {
        this.id = id;
        this.language = language;
        this.value = value;
    }
    Word.prototype.getID = function () {
        return this.id;
    };
    return Word;
}());
exports.Word = Word;
