import "reflect-metadata";
import { createConnection, Connection, Repository } from "typeorm";
import { Language } from "../../domain/Language";
import { Word } from "../../domain/Word";
import { Translation } from "../../domain/Translation";
import { PracticeList } from "../../domain/PracticeList";

let languageRepository : Repository<Language>;
let setUpDatabase: Promise<void> = createConnection({
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
        Language,
        Word,
        Translation,
        PracticeList        
    ]
}).then((connection) => {
    languageRepository = connection.getRepository(Language);
    console.log("Created language repsitory");

    return Promise.resolve();
});

export {
    setUpDatabase,
    languageRepository
};