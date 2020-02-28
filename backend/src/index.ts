import startHttpServer from './config/http/HttpConf'
import { setUpDatabase } from './config/typeorm/TypeOrmConf';

setUpDatabase
.then(() => startHttpServer)
.then(() => console.log("Started up the LearnAnyLanguage backend."))
.catch((error) => console.error("Error while starting up the LearnAnyLanguage backend: " + error));

