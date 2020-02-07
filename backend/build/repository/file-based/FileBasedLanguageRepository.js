"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Repository_1 = require("../Repository");
var Language_1 = require("../../domain/Language");
var Logger_1 = require("../../util/Logger");
var fs_extra_1 = __importDefault(require("fs-extra"));
var config_json_1 = __importDefault(require("../../config/config.json"));
var class_transformer_1 = require("class-transformer");
var FileBasedLanguageRepository = /** @class */ (function (_super) {
    __extends(FileBasedLanguageRepository, _super);
    function FileBasedLanguageRepository() {
        var _this = _super.call(this) || this;
        _this.location = config_json_1.default.repos.language.location;
        _this.languagesMap = new Map();
        _this.initialize();
        return _this;
    }
    FileBasedLanguageRepository.prototype.findAll = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.languagesMap.size == 0) {
                reject("Cache not yet loaded.");
            }
            else {
                resolve(Array.from(_this.languagesMap.values()));
            }
        });
    };
    FileBasedLanguageRepository.prototype.findById = function (id) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.languagesMap.size == 0) {
                reject("Cache not yet loaded.");
            }
            else if (_this.languagesMap.has(id)) {
                resolve(_this.languagesMap.get(id));
            }
            else {
                reject("No language with id '${id}'");
            }
        });
    };
    FileBasedLanguageRepository.prototype.initialize = function () {
        var _this = this;
        this.ensureRepoExists()
            .then(function () { return _this.readRepoFile(); })
            .then(function (fileContents) { return _this.cache(fileContents); })
            .then(function () { return Logger_1.Logger.log("FileBasedLanguageRepository initialized under directory %s ", _this.location); })
            .catch(function (reason) { return Logger_1.Logger.error("FileBasedLanguageRepository not initialized due to: '%s'", reason); });
    };
    FileBasedLanguageRepository.prototype.ensureRepoExists = function () {
        return fs_extra_1.default.ensureFile(this.location);
    };
    FileBasedLanguageRepository.prototype.readRepoFile = function () {
        return fs_extra_1.default.readFile(this.location, "UTF-8");
    };
    FileBasedLanguageRepository.prototype.cache = function (fileContents) {
        var _this = this;
        var languages = class_transformer_1.deserializeArray(Language_1.Language, fileContents);
        languages.forEach(function (language) { return _this.languagesMap.set(language.iso2Code, language); });
        return Promise.resolve();
    };
    return FileBasedLanguageRepository;
}(Repository_1.Repository));
var languageRepository = new FileBasedLanguageRepository();
exports.default = languageRepository;
