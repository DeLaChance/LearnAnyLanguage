"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var LanguageRestController_1 = __importDefault(require("../../adapter/http/LanguageRestController"));
var config_json_1 = __importDefault(require("../config.json"));
var body_parser_1 = __importDefault(require("body-parser"));
var httpServer = express_1.default();
var port = config_json_1.default.httpServer.port;
httpServer.listen(port, function (error) {
    if (error) {
        return console.error(error);
    }
    return console.log("The HTTP server is listening on " + port);
});
httpServer.use(body_parser_1.default.json());
httpServer.get('/', function (req, res) {
    res.send('The sedulous hyena ate the antelope!');
});
httpServer.use('/api/languages', LanguageRestController_1.default);
var startHttpServer = Promise.resolve();
exports.default = startHttpServer;
