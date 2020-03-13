import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { Language } from "./domain/Language";
import { Word } from "./domain/Word";
import { Translation } from "./domain/Translation";
import { PracticeList } from "./domain/PracticeList";
import { AddLanguagesMigration1583510854834 } from './config/migrations/AddLanguagesMigration';
import { TranslationAttempt } from './domain/TranslationAttempt';
import { PracticeRun } from './domain/PracticeRun';

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
        PracticeList,
        PracticeRun,
        TranslationAttempt
    ],
    migrations: [
        AddLanguagesMigration1583510854834
    ],
    migrationsRun: true
};