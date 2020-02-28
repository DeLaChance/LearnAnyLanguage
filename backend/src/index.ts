import { NestFactory } from '@nestjs/core';

import config from './config/config.json';
import { AppModule } from './config/modules/AppModule';
import { Logger } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const host = config.httpServer.host;
    const port = config.httpServer.port;
    await app.listen(port, host);

    Logger.log("Started up the LearnAnyLanguage backend at ${host}:${port}");
}

bootstrap();