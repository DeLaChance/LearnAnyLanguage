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
const class_transformer_1 = require("class-transformer");
const typeorm_1 = require("typeorm");
const Language_1 = require("./Language");
const Translation_1 = require("./Translation");
/**
 * A practice list is a collection of {@link Translation}'s' from one {@link Language} into another.
 */
let PracticeList = class PracticeList {
    getID() {
        return this.id;
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", String)
], PracticeList.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    typeorm_1.Index({ unique: true }),
    __metadata("design:type", String)
], PracticeList.prototype, "name", void 0);
__decorate([
    typeorm_1.OneToMany(type => Translation_1.Translation, translation => translation.practiceList, { eager: true }),
    __metadata("design:type", Array)
], PracticeList.prototype, "translations", void 0);
__decorate([
    typeorm_1.JoinColumn(),
    typeorm_1.ManyToOne(type => Language_1.Language, { nullable: false, eager: true }),
    class_transformer_1.Transform(language => language.iso2Code),
    __metadata("design:type", Language_1.Language)
], PracticeList.prototype, "source", void 0);
__decorate([
    typeorm_1.JoinColumn(),
    typeorm_1.ManyToOne(type => Language_1.Language, { nullable: false, eager: true }),
    class_transformer_1.Transform(language => language.iso2Code),
    __metadata("design:type", Language_1.Language)
], PracticeList.prototype, "target", void 0);
PracticeList = __decorate([
    typeorm_1.Entity()
], PracticeList);
exports.PracticeList = PracticeList;
