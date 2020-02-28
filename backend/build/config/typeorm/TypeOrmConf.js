"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var typeorm_1 = require("typeorm");
var Language_1 = require("../../domain/Language");
var languageRepository;
exports.languageRepository = languageRepository;
var setUpDatabase = typeorm_1.createConnection({
    "type": "postgres",
    "host": "192.168.178.61",
    "port": 32300,
    "username": "octoprint",
    "password": "octoprint",
    "database": "learnalanguage",
    "schema": "learnalanguage",
    "synchronize": true,
    "logging": false,
    "entities": [
        Language_1.Language
    ]
}).then(function (connection) {
    exports.languageRepository = languageRepository = connection.getRepository(Language_1.Language);
    console.log("Created language repsitory");
    return Promise.resolve();
});
exports.setUpDatabase = setUpDatabase;
