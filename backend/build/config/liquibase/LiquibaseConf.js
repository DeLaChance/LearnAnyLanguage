"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var liquibase = require("liquibase");
var updateDatabase = liquibase({
    defaultsFile: './src/config/liquibase/liquibase.properties'
})
    .run('update');
exports.default = updateDatabase;
