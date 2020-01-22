import express from 'express';
import sqlite from 'sqlite';
import winston from 'winston';
import path from 'path';
import https from 'https';
import fs from 'fs';
import { WasLogger } from './types';

import config from './includes/config';

// logger import 
import './includes/logger';
const { LEVEL, MESSAGE } = require('triple-beam');
const logger: WasLogger = config.debug 
    ? <WasLogger>winston.loggers.get('debug') 
    : <WasLogger>winston.loggers.get('production');
const dbLogger: winston.Logger = winston.loggers.get('db');

const dbPromise: Promise<sqlite.Database> = sqlite.open(path.join(__dirname, config.db));

// express setup
const port: number = config.port || 3000;
let sslOptions: https.ServerOptions;

const app: express.Express = express();
app.use(express.static(path.join(__dirname, "dist")));

// db setup + express start

( async () => {
    try {
        logger.app('Open SQLite database at %s', config.db);
        const db: sqlite.Database = await dbPromise;

        const migrationForce: boolean = true;
        logger.app('Migrating database. force=%s', migrationForce);
        await db.migrate({ force: migrationForce ? 'last' : undefined });
        
        logger.app('Reading ssl key and cert from ', config.ssl);
        let key = await fs.promises.readFile(config.ssl.key);
        let cert = await fs.promises.readFile(config.ssl.cert);
        sslOptions = { key, cert };

        logger.app('Starting node https server');
        https.createServer(sslOptions, app).listen({ port }, () => {
            logger.app('-------- SERVER IS RUNNING --------');
            logger.app('at: https://localhost:%d', port);
        });
    } catch (err) {
        logger.error(err);
        process.exit(1);
    }
    
})();


