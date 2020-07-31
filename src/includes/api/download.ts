// -- download api route --

/// <reference types="better-sqlite3"/>

import express from 'express';
import { secure } from './../authentication';
import sqlite from 'better-sqlite3';
import DB from 'better-sqlite3-helper';
import bodyParser from 'body-parser';
import { logger, dbLogger } from './../logger';
import { SQL, User } from './../../types';
import { round } from './../helper';
import config from './../config';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import puppeteer from 'puppeteer';
import socketio from 'socket.io';


// init router
export function router(io: socketio.Server) : express.Router {

const r: express.Router = express.Router();

// sql querys

// routes

r.post('/', secure, bodyParser.json(), function(req, res) {

    res.connection.setTimeout(20000);
    logger.http('GET api.download /');

    // generate ota, write into database
    if (!req.body.url || !req.body.soiid || !req.body.ref) {
        logger.warn("GET api.download / url/soiid/ref object missing in request");
        res.status(400).json({ error: 'add url/soiid/ref to request', errorid: 143 });
        return;
    }

    let oat: string = uuidv4();

    DB().insert('postprocessing', {
        resource: req.body.url,
        login_id: (req.user as User).id,
        uuid: oat
    });

    let u: string = 'https://'+config.ip.ipv4+req.body.url+'?oat='+oat;
    console.log(u);
    // use pupeteer to save pdf to tmp folder
    (async () => {
        const browser = await puppeteer.launch({
            ignoreHTTPSErrors: true,
            args: ['--ignore-certificate-errors']
        });
        const page = await browser.newPage();
        
        
        await page.goto(u, { 
            waitUntil: "networkidle0"
        });
        await page.emulateMediaType('screen');
        await page.pdf({
            path: path.join(__dirname, "..", "..", "static", "pdfs", oat+".pdf"), 
            format: 'A4',
            margin: {
                top: '10px',
                bottom: '10px',
                left: '10px',
                right: '10px'
            }
        });    
        await browser.close();
        io.to(req.body.soiid).emit('post_progress_done', req.body.ref);
    })();
    // send back link to pdf download
    res.status(200).json({ success: "success", pdfurl: "/static/pdfs/"+oat+".pdf" });
});

return r;

};