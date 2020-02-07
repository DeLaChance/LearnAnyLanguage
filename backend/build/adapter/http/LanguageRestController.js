"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var FileBasedLanguageRepository_1 = __importDefault(require("../../repository/file-based/FileBasedLanguageRepository"));
var express_1 = __importDefault(require("express"));
var class_transformer_1 = require("class-transformer");
var router = express_1.default.Router();
router.get("/", function (req, res) { return findAllLanguages(res); });
router.get("/:iso2Code", function (req, res) { return findLanguageByIsoCode(req, res); });
function findAllLanguages(res) {
    FileBasedLanguageRepository_1.default.findAll()
        .then(function (languages) {
        var body = class_transformer_1.serialize(languages);
        res.send(body).setHeader('Content-Type', "application/json");
    })
        .catch(function (reason) { return res.status(500).send(reason); });
}
function findLanguageByIsoCode(req, res) {
    FileBasedLanguageRepository_1.default.findById(req.params.iso2Code)
        .then(function (language) {
        var body = class_transformer_1.serialize(language);
        res.send(body).setHeader('Content-Type', "application/json");
    })
        .catch(function (reason) { return res.status(500).send(reason); });
}
exports.default = router;
