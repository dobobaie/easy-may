import express, { Express } from 'express';
import cors from 'cors';

import errorMap from './app/errors';
import { IProviderApp } from './provider';
import { RegisterRoutes } from './routes/routes';
import { WinstonMiddleware } from './backend-lib';
import {
  jsonContentMiddleware,
  errorMiddleware,
  metaMiddleware,
  filterMiddleware,
  timeoutMiddleware
} from './backend-lib/middlewares';

const tsoaConfig: any = require('../tsoa.json');

export default (app: IProviderApp): Express => {
  const server: Express = express();
  server.use(timeoutMiddleware(app.config.server.timeout));
  server.use(WinstonMiddleware(app.config));
  server.use(cors());
  server.use(jsonContentMiddleware());
  server.use(metaMiddleware());
  server.use(filterMiddleware());
  RegisterRoutes(server);
  server.use(errorMiddleware(app.logger)(errorMap));
  return server;
};
