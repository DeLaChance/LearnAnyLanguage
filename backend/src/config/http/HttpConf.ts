import express from 'express';

import languagesRouter from '../../adapter/http/LanguageRestController';
import config from '../config.json';
import bodyParser from "body-parser";

const httpServer = express();
const port = config.httpServer.port;

httpServer.listen(port, error => {
  if (error) {
    return console.error(error);
  }

  return console.log(`The HTTP server is listening on ${port}`);
});

httpServer.use(bodyParser.json());
httpServer.get('/', (req, res) => {
  res.send('The sedulous hyena ate the antelope!');
});

httpServer.use('/api/languages', languagesRouter);

let startHttpServer: Promise<void> = Promise.resolve();
export default startHttpServer;