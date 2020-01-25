/// <reference types="better-sqlite3"/>

// execute logger init for the first time
import './includes/logging';
import { logger, dbLogger } from './includes/logger';
import { User } from './types';
import express from 'express';
import sqlite from 'better-sqlite3';
import { Database, Statement } from 'better-sqlite3';
import DB from 'better-sqlite3-helper'; 
import winston from 'winston';
import path from 'path';
import https from 'https';
import fs from 'fs';

import passport from 'passport';
import express_session from 'express-session';
import { Strategy } from 'passport-local';
import bodyParser from 'body-parser';

import config from './includes/config';
import initAuth from './includes/authentication';


// express setup
const port: number = config.port || 3000;
let sslOptions: https.ServerOptions;

const app: express.Express = express();
app.use(express.static(path.join(__dirname, "dist")));
app.use(express_session({ 
    secret: "was2020",
    saveUninitialized: false,
    resave: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());


// db setup + express start
( async () => {
    try {
        const migrationForce: boolean = true;
        logger.app('Open SQLite database at %s', config.db);
        DB({
            path: path.join(__dirname, config.db),
            migrate: {
                force: 'last',
                table: 'migration',
                migrationsPath: path.join(__dirname, 'migrations')
            }
        });
        DB().defaultSafeIntegers(false);       
        logger.app('Migrating database. force=%s', migrationForce);
        
        logger.app('Reading ssl key and cert from ', config.ssl);
        let key = await fs.promises.readFile(config.ssl.key);
        let cert = await fs.promises.readFile(config.ssl.cert);
        sslOptions = { key, cert };

        logger.app('Starting node https server');
        https.createServer(sslOptions, app).listen({ port }, () => {
            logger.app('-------- SERVER IS RUNNING --------');
            logger.app('at: https://localhost:%d', port);
        });

        logger.app("Init Atúthentication with passport");
        initAuth(passport);

    } catch (err) {
        logger.error(err.toString());
        process.exit(1);
    }
    
})();





// login controller 
app.post('/login', 
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
    }));

process.on('exit', () => DB().close());
process.on('SIGHUP', () => process.exit(128 + 1));
process.on('SIGINT', () => process.exit(0));
process.on('SIGTERM', () => process.exit(128 + 15));
