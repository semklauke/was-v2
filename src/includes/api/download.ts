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

    if (res.connection) res.connection.setTimeout(20000);
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

r.post('/all/slow', secure, bodyParser.json(), function(req, res) {

    if (res.connection) res.connection.setTimeout(20000);
    logger.http('GET api.download.all /');

    // generate ota, write into database
    if (!req.body.urls || !req.body.soiid) {
        logger.warn("GET api.download.all / urls/soiid object missing in request");
        res.status(400).json({ error: 'add urls/soiid to request', errorid: 1413 });
        return;
    }

    let oats: string[] = [];
    let login_id: any = (req.user as User).id;
    let pdfurls: string[] = [];

    for (const [url_index, url] of req.body.urls.entries()) {
        oats.push(uuidv4());
        pdfurls.push("/static/pdfs/"+oats[url_index]+".pdf");
        DB().insert('postprocessing', {
            resource: url,
            login_id,
            uuid: oats[url_index]
        });
    }

    let url_count = oats.length;
    let slice_size = Math.round(url_count / 3);
    for (let slice_index = 0; slice_index < url_count; slice_index += slice_size) {

        let oats_slice: string[];
        let urls_slice: string[];

        if ((slice_index + slice_size) >= url_count) {
            oats_slice = oats.slice(slice_index);
            urls_slice = req.body.urls.slice(slice_index);
        } else {
            oats_slice = oats.slice(slice_index, slice_index+slice_size);
            urls_slice = req.body.urls.slice(slice_index, slice_index+slice_size);
        }    

        (async (oats_array, urls, soiid) => {
            const baseurl: string = 'https://'+config.ip.ipv4;
            const browser = await puppeteer.launch({
                ignoreHTTPSErrors: true,
                args: ['--ignore-certificate-errors']
            });

            const page = await browser.newPage();
            await page.emulateMediaType('screen');

            for (const [url_index, url] of urls.entries()) {
                
                await page.goto(baseurl+url+'?oat='+oats_array[url_index], { 
                    waitUntil: "networkidle0",
                    timeout: 0,
                });
                
                await page.pdf({
                    path: path.join(__dirname, "..", "..", "static", "pdfs", oats_array[url_index]+".pdf"), 
                    format: 'A4',
                    margin: {
                        top: '10px',
                        bottom: '10px',
                        left: '10px',
                        right: '10px'
                    }
                });    
                io.to(soiid).emit('post_progress_progress', url_index);
            }
            await browser.close();
        })(oats_slice, urls_slice, req.body.soiid);        
    }
    // use pupeteer to save pdf to tmp folder
    
    // send back links to pdf download
    res.status(200).json({ success: "success", pdfurls });
});

r.post('/all', secure, bodyParser.json(), function(req, res) {

    if (res.connection) res.connection.setTimeout(20000);
    logger.http('GET api.download.all /');

    // generate ota, write into database
    if (!req.body.urls || !req.body.soiid) {
        logger.warn("GET api.download.all / urls/soiid object missing in request");
        res.status(400).json({ error: 'add urls/soiid to request', errorid: 1413 });
        return;
    }

    let oats: string[] = [];
    let login_id: any = (req.user as User).id;
    let pdfurls: string[] = [];

    for (const [url_index, url] of req.body.urls.entries()) {
        oats.push(uuidv4());
        pdfurls.push("/static/pdfs/"+oats[url_index]+".pdf");
        DB().insert('postprocessing', {
            resource: url,
            login_id,
            uuid: oats[url_index]
        });

        (async (soiid) => {
            const baseurl: string = 'https://'+config.ip.ipv4;
            const browser = await puppeteer.launch({
                ignoreHTTPSErrors: true,
                args: ['--ignore-certificate-errors']
            });

            const page = await browser.newPage();
            await page.emulateMediaType('screen');
                
            await page.goto(baseurl+url+'?oat='+oats[url_index], { 
                waitUntil: "networkidle0",
                timeout: 0,
            });
            
            await page.pdf({
                path: path.join(__dirname, "..", "..", "static", "pdfs", oats[url_index]+".pdf"), 
                format: 'A4',
                margin: {
                    top: '10px',
                    bottom: '10px',
                    left: '10px',
                    right: '10px'
                }
            });    
            io.to(soiid).emit('post_progress_progress', url_index);
            await browser.close();
        })(req.body.soiid);

    }
    // use pupeteer to save pdf to tmp folder
    
    // send back links to pdf download
    res.status(200).json({ success: "success", pdfurls });
});

return r;

};