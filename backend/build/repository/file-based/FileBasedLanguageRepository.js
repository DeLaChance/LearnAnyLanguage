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
var config_json_1 = __importDefault(require("../../config/config.json"));
var Language_1 = require("../../domain/Language");
var FileBasedRepository_1 = require("../FileBasedRepository");
var FileBasedLanguageRepository = /** @class */ (function (_super) {
    __extends(FileBasedLanguageRepository, _super);
    function FileBasedLanguageRepository() {
        return _super.call(this, config_json_1.default.repos.language.location, Language_1.Language, "FileBasedLanguageRepository") || this;
    }
    return FileBasedLanguageRepository;
}(FileBasedRepository_1.FileBasedRepository));
var languageRepository = new FileBasedLanguageRepository();
exports.default = languageRepository;
