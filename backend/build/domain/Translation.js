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
exports.Translation = void 0;
const typeorm_1 = require("typeorm");
const PracticeList_1 = require("./PracticeList");
const Word_1 = require("./Word");
const class_transformer_1 = require("class-transformer");
const TranslationAttempt_1 = require("./TranslationAttempt");
/**
 * A {@link Translation} maps one {@link Word} from one language into another {@link Word} from a different one.
 */
let Translation = /** @class */ (() => {
    var Translation_1;
    let Translation = Translation_1 = class Translation {
        getID() {
            return this.id;
        }
        determineSource(sourceToTarget) {
            if (sourceToTarget) {
                return this.source.value;
            }
            else {
                return this.target.value;
            }
        }
        determineCorrectAnswer(sourceToTarget) {
            if (sourceToTarget) {
                return this.target.value;
            }
            else {
                return this.source.value;
            }
        }
        static from(sourceWord, targetWord, practiceList) {
            let translation = new Translation_1();
            translation.source = sourceWord;
            translation.target = targetWord;
            translation.practiceList = practiceList;
            translation.translationAttempts = [];
            return translation;
        }
    };
    __decorate([
        typeorm_1.PrimaryGeneratedColumn(),
        __metadata("design:type", Number)
    ], Translation.prototype, "id", void 0);
    __decorate([
        typeorm_1.ManyToOne(type => Word_1.Word, { nullable: false, eager: true }),
        typeorm_1.JoinColumn(),
        class_transformer_1.Transform(word => word.value),
        __metadata("design:type", Word_1.Word)
    ], Translation.prototype, "source", void 0);
    __decorate([
        typeorm_1.ManyToOne(type => Word_1.Word, { nullable: false, eager: true }),
        typeorm_1.JoinColumn(),
        class_transformer_1.Transform(word => word.value),
        __metadata("design:type", Word_1.Word)
    ], Translation.prototype, "target", void 0);
    __decorate([
        typeorm_1.ManyToOne(type => PracticeList_1.PracticeList, practiceList => practiceList.translations),
        class_transformer_1.Exclude(),
        __metadata("design:type", PracticeList_1.PracticeList)
    ], Translation.prototype, "practiceList", void 0);
    __decorate([
        typeorm_1.OneToMany(type => TranslationAttempt_1.TranslationAttempt, translationAttempt => translationAttempt.translation, { eager: false }),
        class_transformer_1.Exclude(),
        __metadata("design:type", Array)
    ], Translation.prototype, "translationAttempts", void 0);
    Translation = Translation_1 = __decorate([
        typeorm_1.Entity()
    ], Translation);
    return Translation;
})();
exports.Translation = Translation;
