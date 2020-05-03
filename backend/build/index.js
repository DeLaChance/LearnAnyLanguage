"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const config_json_1 = __importDefault(require("./config/config.json"));
const AppModule_1 = require("./config/modules/AppModule");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const app = await core_1.NestFactory.create(AppModule_1.AppModule);
    app.enableCors({
        origin: "*"
    });
    const host = config_json_1.default.httpServer.host;
    const port = config_json_1.default.httpServer.port;
    await app.listen(port, host);
    common_1.Logger.log(`Started up the LearnAnyLanguage backend at ${host}:${port}`);
    app.useGlobalPipes(new common_1.ValidationPipe());
}
bootstrap();
