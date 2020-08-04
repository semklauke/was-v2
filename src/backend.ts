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
import http from 'http';
import fs from 'fs';
import socketio from 'socket.io';
import url from 'url';

import passport from 'passport';
import express_session from 'express-session';
import { Strategy } from 'passport-local';
import bodyParser from 'body-parser';

import config from './includes/config';
import { initAuthentication, secure, secureFrontend } from './includes/authentication';

// important globals
const app: express.Express = express();
let server: https.Server;
let server6: https.Server;
let server_http: http.Server;
let io: socketio.Server;

// express setup
const port_https: number = config.port || 443;
const port_http: number = 80;
let sslOptions: https.ServerOptions;

app.use('/assets', express.static(path.resolve(__dirname, config.frontend_folder, 'assets')));
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
try {
    logger.app('Open SQLite database at %s', config.db);
    const mig = config.debug == true ? 'last' : false;
    DB({
        path: path.join(__dirname, config.db),
        migrate: {
            force: mig,
            table: 'migration',
            migrationsPath: path.join(__dirname, 'migrations')
        }
    });
    DB().defaultSafeIntegers(false);       
    logger.app('Migrating database. force=%s', mig);

    logger.app('Reading ssl key and cert from ', config.ssl);
    let key = fs.readFileSync(config.ssl.key);
    let cert = fs.readFileSync(config.ssl.cert);
    sslOptions = { key, cert };

    logger.app('Starting node https server on ipv4 and ipv6');

    server = https.createServer(sslOptions, app).listen(port_https, config.ip.ipv4, () => {
        logger.app('-------- IPv4 SERVER IS RUNNING --------');
        logger.app('at: https://%s:%d', config.ip.ipv4, port_https);
    });

    if (config.ipv6) {
        server6 = https.createServer(sslOptions, app).listen(port_https, config.ip.ipv6, () => {
            logger.app('-------- IPv6 SERVER IS RUNNING --------');
            logger.app('at: https://[%s]:%d', config.ip.ipv6, port_https);
        });
    }

    server_http = http.createServer(app).listen(port_http, config.ip.ipv4, () => {
        logger.app('http ipv4 server running also :(');
    })

    logger.app("Init Authentication with passport");
        initAuthentication(passport);

    logger.app("Start Socket.IO websocket server");
    //@ts-ignore
    io = new socketio();
    io.attach(server);
    io.attach(server_http);
    io.on('connection', initSocket);

} catch (err) {
    logger.error(err.toString());
    process.exit(1);
}



// login controller

app.get('/login', function(req, res) {
    res.sendFile(path.resolve(__dirname, config.frontend_folder, 'login.html'));
});

app.get('/logout', function(req, res) {
    req.logout();
    let rd = () => { res.redirect('/login') };
    if (req.session) {
        req.session.destroy(rd);
    } else
        rd();
})
app.post('/login', 
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login?info=w',
    })
);

import { router as api_walker } from './includes/api/walker';
app.use('/api/walker', api_walker(io));

import { router as api_donation } from './includes/api/donation';
app.use('/api/donation', api_donation(io));

import { router as api_overview } from './includes/api/overview';
app.use('/api/overview', api_overview);

// post production
import { router as post_production_class } from './includes/api/class';
app.use('/post/class', post_production_class);

import { router as post_production_class_final } from './includes/api/final';
app.use('/post/final', post_production_class_final);

import { router as post_production_form } from './includes/api/form';
app.use('/post/form', post_production_form);

import { router as post_production_download } from './includes/api/download';
app.use('/post/download', post_production_download(io));

// serve vue frontend
app.get('*', secureFrontend, function(req, res){
    res.sendFile(path.resolve(__dirname, config.frontend_folder, 'index.html'));  
});

// socket io stuff
let CONNECTIONS: number = 0;
let CURRENT_LOCKS: { [key: string] : any } = {};
function initSocket(socket: socketio.Socket) : void {
    CONNECTIONS++;

    io.emit('user_count_changed', CONNECTIONS);

    socket.on("walker_lock", function(data) {
        socket.broadcast.emit("walker_lock", data);
        logger.debug("LOCK "+data);
        CURRENT_LOCKS[socket.id] = data;
    });

    socket.on('walker_unlock', function(data){
      socket.broadcast.emit('walker_unlock', data);
      logger.debug("UNLOCK "+data);
      delete CURRENT_LOCKS[socket.id];
    });

    socket.on('disconnect', function(){
        if (CURRENT_LOCKS[socket.id] != undefined) {
            socket.broadcast.emit("walker_unlock", parseInt(CURRENT_LOCKS[socket.id]));
            delete CURRENT_LOCKS[socket.id];
        }

        CONNECTIONS--;
        io.emit('user_count_changed', CONNECTIONS);

    });

    socket.on('heartbeat', () => {});

    for (let key_locks in CURRENT_LOCKS) {
        socket.emit('walker_lock', CURRENT_LOCKS[key_locks]);
    }

}


process.on('exit', () => DB().close());
process.on('SIGHUP', () => process.exit(128 + 1));
process.on('SIGINT', () => process.exit(0));
process.on('SIGTERM', () => process.exit(128 + 15));