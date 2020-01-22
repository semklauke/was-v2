import express from 'express';
import sqlite from 'sqlite';
import winston from 'winston';
import path from 'path';

//import Promise from 'bluebird';
import config from './includes/config';

import './includes/logger';
const logger: winston.Logger = config.debug ? winston.loggers.get('debug') : winston.loggers.get('production');
const dbLogger: winston.Logger = winston.loggers.get('db');


const port = config.port || 3000;

const app: express.Express = express();
const dbPromise: Promise<sqlite.Database> = sqlite.open(path.join(__dirname, config.db));



// setup 

( async () => {
  const db: sqlite.Database = await dbPromise;
  const migration_force: boolean = true;
  logger.info('Migrating database. force=%s', migration_force);
  db.migrate({ });

})();