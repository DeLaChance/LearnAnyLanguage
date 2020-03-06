import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { Language } from "./domain/Language";
import { Word } from "./domain/Word";
import { Translation } from "./domain/Translation";
import { PracticeList } from "./domain/PracticeList";

export const withCache: TypeOrmModuleOptions = {
    type: "postgres",
    host: "192.168.178.61",
    port: 32300,
    username: "octoprint",
    password: "octoprint",
    database: "learnalanguage",
    schema: "learnalanguage",
    synchronize: true,
    logging: false,
    autoLoadEntities: true,
    entities: [
        Language,
        Word,
        Translation,
        PracticeList 
    ],
};