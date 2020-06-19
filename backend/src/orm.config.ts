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
    host: process.env.DB_HOST ? process.env.DB_HOST : "localhost",
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
    username: process.env.DB_USER ? process.env.DB_USER : "postgres",
    password: process.env.DB_PASSWORD ? process.env.DB_PASSWORD : "postgres",
    database: "learnanylanguage",
    schema: "learnanylanguage",
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