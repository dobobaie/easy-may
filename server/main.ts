import 'reflect-metadata';

import fs from 'fs';
import Lib from './backend-lib';

import Config, { IConfig } from './app/config';
import StaticProvider, { IProviderApp, IProviderModules } from './provider';
import Server from './server';

/*** Secure ***/
let logger: any = console;
const perror = (_: string, error: Error) => {
  console.error(error.stack);
  logger.error(error.stack);
  process.kill(process.pid, 'SIGUSR2');
  process.exit(1);
};
(process as NodeJS.EventEmitter).on('uncaughtException', (error: Error) =>
  perror('uncaughtException', error)
);
(process as NodeJS.EventEmitter).on('unhandledRejection', (error: Error) =>
  perror('unhandledRejection', error)
);

/*** Instances ***/
const config: IConfig = Config(process.env);
const pTypeorm: Promise<any> = Lib.modules.typeorm(config);
logger = Lib.modules.winston(config);

/*** Cloud init ***/
fs.mkdirSync(config.storage.path, { recursive: true });

/*** Initialize app ***/
export default Promise.all([pTypeorm]).then(([]) => {
  /*** App ***/
  const app: IProviderApp = {
    config,
    logger
  };

  /*** Modules ***/
  const modules: IProviderModules = {
    server: Server(app)
  };

  /*** Provider ***/
  StaticProvider.set({ app, modules });

  /*** Run server ***/
  if (!module.parent) {
    // eslint-disable-next-line
    modules?.server?.listen(config.server.port, () =>
      logger.info(`Server started listening to port ${config.server.port}`)
    );
  }
});
