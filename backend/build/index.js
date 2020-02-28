"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var HttpConf_1 = __importDefault(require("./config/http/HttpConf"));
var TypeOrmConf_1 = require("./config/typeorm/TypeOrmConf");
TypeOrmConf_1.setUpDatabase
    .then(function () { return HttpConf_1.default; })
    .then(function () { return console.log("Started up the LearnAnyLanguage backend."); })
    .catch(function (error) { return console.error("Error while starting up the LearnAnyLanguage backend: " + error); });
