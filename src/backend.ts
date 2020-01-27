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
import { initAuthentication, secure } from './includes/authentication';


// express setup
const port: number = config.port || 3000;
let sslOptions: https.ServerOptions;

const app: express.Express = express();
app.use(express.static(path.resolve(__dirname, config.frontend_folder)));
app.use('/static', express.static(path.resolve(__dirname, 'static')));
app.set('view engine', 'ejs');

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
        initAuthentication(passport);

    } catch (err) {
        logger.error(err.toString());
        process.exit(1);
    }
    
})();



// login controller

app.get('/login', function(req, res) {
    res.sendFile(path.resolve(__dirname, config.frontend_folder, 'login.html'));
});

app.post('/login', 
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
    })
);

import { router as api_walker } from './includes/api/walker';
app.use('/api/walker', api_walker);

import { router as api_donation } from './includes/api/donation';
app.use('/api/donation', api_donation);

// post production
import { router as post_production_class } from './includes/api/class';
app.use('/post/class', post_production_class);

import { router as post_production_class_final } from './includes/api/final';
app.use('/post/final', post_production_class_final);

// serve vue frontend
app.get('*', function(req, res){
    res.sendFile(path.resolve(__dirname, config.frontend_folder, 'index.html'));  
});


process.on('exit', () => DB().close());
process.on('SIGHUP', () => process.exit(128 + 1));
process.on('SIGINT', () => process.exit(0));
process.on('SIGTERM', () => process.exit(128 + 15));