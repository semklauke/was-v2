// -- donation api route --

/// <reference types="better-sqlite3"/>

import express from 'express';
import { secure } from './../authentication';
import sqlite from 'better-sqlite3';
import DB from 'better-sqlite3-helper';
import socketio from 'socket.io';
import bodyParser from 'body-parser';
import { logger, dbLogger } from './../logger';
import { Walker, Donation, SQL, WalkerTransfer } from './../../types'

// sql querys

const sql_donation: SQL = `
    SELECT * FROM donations WHERE rec_id = ?;
`;

const sql_donation_all: SQL = `
    SELECT * FROM donations;
`;
const sql_donation_for_walker: SQL = `
    SELECT * FROM donations WHERE walker_id = ?
`;

const sql_delete_donations: SQL = `
    DELETE FROM donations WHERE rec_id = ?
`;

const sql_delete_donations_walker: SQL = `
    DELETE FROM donations WHERE walker_id = ?
`;
const sql_walker: SQL = `
   SELECT rec_id, firstname, lastname FROM walkers WHERE rec_id = ?
`;

// init router
export function router(io: socketio.Server) : express.Router {

const r: express.Router = express.Router();


r.get('/', secure, function(req, res){

    logger.http('GET api.donation /');
    /*//@ts-ignore
    logger.info("ALL by %s", req.user.username);*/

    let stmt = DB().prepare(sql_donation_all);
    let donations: Donation[] = stmt.all();
    res.status(200).json({ success: "Success", donations });

});

r.post('/', secure, bodyParser.json(), function(req, res){

    // donation insert
    logger.http("POST api.donation /",);

    if (!req.body.donation || req.body.donation == {}) {
        logger.warn("POST api.donation / Donation object missing in request");
        res.status(400).json({ error: 'add Donation needs a Donation object in the request data', errorid: 203 });
        return;
    }

    let d: Donation = req.body.donation;

    // check wether the walker exist
    //@ts-ignore
    if (!d.walker_id || d.walker_id === undefined || d.walker_id == '') {
        logger.warn("POST api.donation / Walker id of Donation object missing in request");
        res.status(400).json({ error: 'add Donation needs a Walker id in the request data', errorid: 207 });
        return;
    }
    let walker: Walker | undefined = DB().queryFirstRow(sql_walker, d.walker_id);
    if (walker == undefined) {
        logger.warn("POST api.donation / No such walker id exists: (%d)", d.walker_id);
        res.status(404).json({ error: 'The Walker id '+d.walker_id+' does not exist', errorid: 208 });
        return;
    }

    const donation_id: number = 
        DB().insert('donations', d);

    logger.info(
        "Donation (%d) from %s to Walker %s (%d) added by %s",
        donation_id, d.firstname+" "+d.lastname,
        walker.firstname+" "+walker.lastname, walker.rec_id,
        //@ts-ignore
        req.user.name
    );   

    res.status(200).json({ success: "Donation added", rec_id: donation_id });
});

r.post('/walker/:walker_id', secure, bodyParser.json(), function(req, res){

    let walker_id: number = parseInt(req.params.walker_id);
    logger.http("POST api.donation /walker/%d (:walker_id)", walker_id);

    if (!req.body.donation || req.body.donation == {}) {
        logger.warn("POST api.donation /walker/%d (:walker_id) Donation object missing in request", walker_id);
        res.status(400).json({ error: 'add Donation needs a Donation object in the request data', errorid: 209 });
        return;
    }

    let d: Donation = req.body.donation;
    d.walker_id = walker_id;

    // check wether the walker exist
    let walker: Walker | undefined = DB().queryFirstRow(sql_walker, walker_id);
    if (walker == undefined) {
        logger.warn("POST api.donation /walker/%d (:walker_id) No such walker id exists", walker_id);
        res.status(404).json({ error: 'The Walker id '+walker_id+' does not exist', errorid: 210 });
        return;
    }

    const donation_id: number = 
        DB().insert('donations', d);

    logger.info(
        "Donation (%d) from %s to Walker %s (%d) added by %s",
        donation_id, d.firstname+" "+d.lastname,
        walker.firstname+" "+walker.lastname, walker.rec_id,
        //@ts-ignore
        req.user.name
    );   

    res.status(200).json({ success: "Donation added", rec_id: donation_id });
});


r.get('/walker/:walker_id', secure, function(req, res){
    
    let walker_id: number = parseInt(req.params.walker_id);
    logger.http("GET api.donation /walker/%d (:walker_id)", walker_id);

    /*//@ts-ignore
    logger.debug("Donations of Walker (%d) selected by %s", walker_id, req.user.name);*/
    
    let d = DB().query<Donation>(sql_donation_for_walker, walker_id);
    if (!d || !d.length || d.length == 0) {
        logger.warn("GET api.donation /walker/%d No such Walker id", walker_id);
        res.status(404).json({ error: 'Walker id '+walker_id+' does not exist', errorid: 201 });
        return;
    }
    res.status(200).json({ success: "Success", donations: d });

});

r.get('/:donation_id', secure, function(req, res){
    
    let donation_id: number = parseInt(req.params.donation_id);
    logger.http("GET api.donation /%d (:donation_id)", donation_id);

    /*//@ts-ignore
    logger.debug("Donations of Walker (%d) selected by %s", walker_id, req.user.name);*/
    
    let d = DB().queryFirstRow<Donation>(sql_donation, donation_id);
    if (!d) {
        logger.warn("GET api.donation /%d (:donation_id) No such Donation id", donation_id);
        res.status(404).json({ error: 'Donation id '+donation_id+' does not exist', errorid: 211 });
        return;
    }
    res.status(200).json({ success: "Success", donation: d });

});

r.delete('/walker/:walker_id', secure, function(req, res){
    
    let walker_id: number = parseInt(req.params.walker_id);
    logger.http("DELETE api.donation /walker/%d (:walker_id)", walker_id);

    let stmt: sqlite.Statement = DB().prepare(sql_delete_donations_walker);
    let deletions: number = stmt.run(walker_id).changes;

    if (deletions > 0) {
        //@ts-ignore
        logger.info("%d Donations of Walker (%d) delete by %s", deletions, walker_id, req.user.name);
        res.status(200).json({ success: "Donations deleted", rec_id: walker_id });
    } else {
        logger.warn("DELETE api.donation /walker/%d (:walker?id) No such Walker id", walker_id);
        res.status(404).json({ error: 'Walker id '+walker_id+' does not exist', errorid: 206 });
    }
});

r.put('/:donation_id', secure, bodyParser.json(), function(req, res){

    let donation_id: number = parseInt(req.params.donation_id);
    logger.http("PUT api.donation /%d (:donation_id)", donation_id);

    if (req.body.donation && req.body.donation != {}) {
        let d: Donation = req.body.donation;
        DB().updateWithBlackList('donations', d, { rec_id: donation_id }, ['rec_id']);
        //@ts-ignore
        logger.info('Donation (%d) updated by %s', donation_id, req.user.name);
        res.status(201).json({ success: "Donation updated", rec_id: donation_id });
    } else {
        logger.warn("PUT api.donation /%d (:donation_id) No such Donation id", donation_id);
        res.status(404).json({ error: 'Donation id '+donation_id+' does not exist', errorid: 202 });
    }

});

r.delete('/:donation_id', secure, function(req, res){

    let donation_id: number = parseInt(req.params.donation_id);
    logger.http("DELETE api.donation /%d (:donation_id)", donation_id);

    let stmt: sqlite.Statement = DB().prepare(sql_delete_donations);
    let deletion: number = stmt.run(donation_id).changes;
    
    if (deletion > 0) {
        //@ts-ignore
        logger.info("Donations (%d) delete by %s", donation_id, req.user.name);
        res.json({ success: "Donation deleted", rec_id: donation_id });
    } else {
        logger.warn("DELETE api.donation /%d (:donation_id) No such Donation id", donation_id);
        res.status(404).json({ error: 'Donation id '+donation_id+' does not exist', errorid: 205 });
    }
});

return r;

}