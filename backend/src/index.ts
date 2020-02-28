import runLiquibase from "./config/database/LiquibaseConf";
import startHttpServer from './config/http/HttpConf'

runLiquibase
.then(() => startHttpServer)
.then(() => console.log("Started up the LearnAnyLanguage backend."))
.catch((error) => console.error("Error while starting up the LearnAnyLanguage backend: " + error));

