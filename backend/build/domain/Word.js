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
var Word_1;
Object.defineProperty(exports, "__esModule", { value: true });
const Language_1 = require("./Language");
const typeorm_1 = require("typeorm");
const class_transformer_1 = require("class-transformer");
/**
 * A word is a sequence of characters bound to a particular {@link Language}.
 */
let Word = Word_1 = class Word {
    getID() {
        return this.id;
    }
    static from(value, language) {
        let word = new Word_1();
        word.language = language;
        word.value = value;
        return word;
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    class_transformer_1.Exclude(),
    __metadata("design:type", Number)
], Word.prototype, "id", void 0);
__decorate([
    typeorm_1.ManyToOne(type => Language_1.Language, { nullable: false }),
    typeorm_1.JoinColumn({ name: 'languageIso2Code', referencedColumnName: 'iso2Code' }),
    class_transformer_1.Transform(language => language.iso2Code),
    __metadata("design:type", Language_1.Language)
], Word.prototype, "language", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Word.prototype, "value", void 0);
Word = Word_1 = __decorate([
    typeorm_1.Entity()
], Word);
exports.Word = Word;
