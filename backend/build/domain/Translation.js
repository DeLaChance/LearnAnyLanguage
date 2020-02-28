"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Translation = /** @class */ (function () {
    function Translation(id, source, target) {
        this.id = id;
        this.source = source;
        this.target = target;
    }
    Translation.prototype.getID = function () {
        return this.id;
    };
    return Translation;
}());
exports.Translation = Translation;
