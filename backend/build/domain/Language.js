"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Language = void 0;
const typeorm_1 = require("typeorm");
/**
 *  The method of human communication, either spoken or written, consisting of the use of {@link Word}'s' in a
 *  structured and conventional way.
 */
let Language = /** @class */ (() => {
    let Language = class Language {
        getID() {
            return this.iso2Code;
        }
    };
    __decorate([
        typeorm_1.PrimaryColumn(),
        __metadata("design:type", String)
    ], Language.prototype, "iso2Code", void 0);
    __decorate([
        typeorm_1.Column({
            length: 256
        }),
        __metadata("design:type", String)
    ], Language.prototype, "name", void 0);
    __decorate([
        typeorm_1.Column({
            length: 512,
            nullable: true
        }),
        __metadata("design:type", String)
    ], Language.prototype, "wikipediaDescriptionLink", void 0);
    __decorate([
        typeorm_1.Column({
            length: 512,
            nullable: true
        }),
        __metadata("design:type", String)
    ], Language.prototype, "learnMoreWikipediaLink", void 0);
    Language = __decorate([
        typeorm_1.Entity()
    ], Language);
    return Language;
})();
exports.Language = Language;
