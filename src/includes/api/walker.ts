// -- walker api route --

/// <reference types="better-sqlite3"/>
/// <reference types="socket.io"/>

import express from 'express';
import { secure } from './../authentication';
import sqlite from 'better-sqlite3';
import DB from 'better-sqlite3-helper';
import bodyParser from 'body-parser';
import socketio from 'socket.io';
import { logger, dbLogger } from './../logger';
import { Walker, Donation, SQL, WalkerTransfer } from './../../types'

// sql querys
const sql_walkerAll: SQL = `
    SELECT walkers.*, 
    (SELECT COUNT(*) FROM donations WHERE walker_id = walkers.rec_id) as donation_count 
    FROM walkers
    ORDER BY walkers.firstname DESC, walkers.lastname DESC, 
    walkers.class DESC, walkers.distance_m DESC;        
`;

const sql_walker: SQL = `
    SELECT * FROM walkers WHERE rec_id = ? LIMIT 1
`;

const sql_donation_for_walker: SQL = `
    SELECT * FROM donations WHERE walker_id = ?
`;

const sql_check_duplicate: SQL = `
    SELECT rec_id FROM walkers WHERE firstname = ? AND lastname = ? AND class = ?
`;

const sql_delete_walker: SQL = `
    DELETE FROM walkers WHERE rec_id = ?
`;

const sql_delete_donations_walker: SQL = `
    DELETE FROM donations WHERE walker_id = ?
`;


// init router
export function router(io: socketio.Server) : express.Router {

const r: express.Router = express.Router();

r.get('/', secure, function(req, res){

    logger.http('GET api.walker /');
    /*//@ts-ignore
    logger.info("ALL by %s", req.user.username);*/

    let stmt = DB().prepare(sql_walkerAll);
    let walker: Walker[] = stmt.all();
    res.status(200).json({ success: "success", walker });

});

r.post('/', secure, bodyParser.json(), function(req, res){

    // walker insert
    logger.http("POST api.walker /",);

    if (!req.body.walker || req.body.walker == {}) {
        logger.warn("POST api.walker / Walker object missing in request");
        res.status(400).json({ error: 'add Walker needs a Walker object in the request data', errorid: 103 });
        return;
    }

    let w: Walker = req.body.walker;
    if (w.course === undefined || (w.course && (w.course == "null" || w.course == "")))
        w.course = null;

    // check for dulicate
    if (req.body.force_duplicate == undefined || req.body.force_duplicate == false) {
        let dup: number = DB().query(sql_check_duplicate, w.firstname, w.lastname, w.class).length;
        if (dup != 0) {
            logger.warn(
                "POST api.walker / Attempt to creat duplicate Walker: %s by %s",
                w.firstname + " " + w.lastname,
                //@ts-ignore
                req.user.name
            );
            res.status(409).json({ error: 'duplicate Walker detected. Please confirm.', errorid: 104, duplicate: true });
            return;
        }
    }
    
    const walker_id: number = DB().insert('walkers', w, ['class', 'firstname', 'lastname', 'distance_m', 'participates', 'course']);
    //@ts-ignore
    logger.info("Walker %s added by %s", w.firstname+" "+w.lastname, req.user.name);
    
    // donations insert if requested
    if (req.body.donations && req.body.donations.length > 0) {

        req.body.donations.forEach(function(value: Donation){
            if (value.rec_id) logger.error("was zum teufel...");
            const donation_id: number = DB().insert('donations', value);
            
            logger.info(
                "Donation from %s (%d) added to Walker (%d) by %s", 
                value.firstname+" "+value.lastname,
                donation_id, walker_id,
                //@ts-ignore
                req.user.name
            );
        });
    }
    w.rec_id = walker_id;
    io.emit("walker_added", w);
    res.status(200).json({ success: "Walker added", rec_id: walker_id });

});

r.get('/:walker_id', secure, function(req, res){
    
    let walker_id: number = parseInt(req.params.walker_id);
    logger.http("GET api.walker /%d (:walker_id)", walker_id);

    

    let w = DB().queryFirstRow<Walker>(sql_walker, walker_id);
    if (!w) {
        logger.warn("GET api.walker /%d No such Walker id", walker_id);
        res.status(404).json({ error: 'Walker id '+walker_id+' does not exist', errorid: 101 });
        return;
    }
    //@ts-ignore
    logger.info("Walker %s (%d) selected by %s", (w.firstname + " " + w.lastname), w.rec_id, req.user.name);
    
    if (req.query.donations != undefined && req.query.donations == 'true') {
        let d = DB().query<Donation>(sql_donation_for_walker, walker_id);
        let data: WalkerTransfer = {
            walker : w,
            donations : d,
        }
        res.status(200).json(data);
    } else {
        res.status(200).json({ success: "success", walker: w });
    }

});

r.put('/:walker_id', secure, bodyParser.json(), function(req, res){

    let walker_id: number = parseInt(req.params.walker_id);
    logger.http("PUT api.walker /%d (:walker_id)", walker_id);

    if (req.body.walker && req.body.walker != {}) {
        if (req.body.walker.course && (req.body.walker.course == "null" || req.body.walker.course == ""))
            req.body.walker.course = undefined;
        
        DB().updateWithBlackList('walkers', req.body.walker, { rec_id: walker_id }, ['rec_id']);
        //@ts-ignore
        logger.info("Walker (%d) updated by %s", walker_id, req.user.name);
    } else {
        res.status(400).json({ error: 'PUT Walker needs a Walker object in the request data', errorid: 113 });
        logger.warn("PUT api.walker /%d (:walker_id) No walker object in request", walker_id);
    }
    
    if (req.body.donations && req.body.donations.length > 0) {

        req.body.donations.forEach(function(value: Donation){
            if (!value.rec_id) {
                logger.warn("PUT api.walker /%d (:walker_id) No rec_id for Donation", walker_id);
                req.body.donations = [];
                res.status(400).json({ error: 'Donation has no rec_id', errorid: 102 });
                return;
            } else {
                DB().updateWithBlackList('donations', value, { rec_id: value.rec_id }, ['rec_id']);
                //@ts-ignore
                logger.info("Donation (%d) of Walker (%d) updated by %s", value.rec_id, walker_id, req.user.name);
            }
        });
    }

    res.status(201).json({ success: "Walker updated", rec_id: walker_id });

});

r.delete('/:walker_id', secure, function(req, res){

    let walker_id: number = parseInt(req.params.walker_id);
    logger.http("DELETE api.walker /%d (:walker_id)", walker_id);

    // delete walker but get name first
    let w = DB().queryFirstRow<Walker>(sql_walker, walker_id);
    if (!w) {
        logger.warn("DELETE api.walker /%d No such Walker id", walker_id);
        res.status(404).json({ error: 'Walker id '+walker_id+' does not exist', errorid: 105 });
        return;
    }

    if (req.query.donations != undefined && req.query.donations == 'true') {
        let stmt: sqlite.Statement = DB().prepare(sql_delete_donations_walker);
        let deletions: number = stmt.run(walker_id).changes;
        logger.info(
            "%d Donations of Walker %s (%d) delete by %s",
            deletions, (w.firstname + " " + w.lastname), walker_id,
            //@ts-ignore
            req.user.name
        );
    }

    DB().prepare(sql_delete_walker).run(walker_id);
    //@ts-ignore
    logger.info("Walker %s (%d) deleted by %s", (w.firstname + " " + w.lastname), walker_id, req.user.name);

    
    io.emit("walker_deleted", walker_id);
    res.status(200).json({ success: "Walker deleted", rec_id: walker_id });
});

return r;

}