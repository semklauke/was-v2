// -- overview api route --

/// <reference types="better-sqlite3"/>

import express from 'express';
import { secure } from './../authentication';
import sqlite from 'better-sqlite3';
import DB from 'better-sqlite3-helper';
import { logger, dbLogger } from './../logger';
import { Walker, Donation, SQL } from './../../types';

// init router
export const router: express.Router = express.Router();

// sql querys
const sql_walker_total: SQL = `
    SELECT COUNT(*) AS count FROM walkers;
`;

const sql_walker_part: SQL = `
    SELECT COUNT(*) AS count FROM walkers WHERE participates = 1;
`;

const sql_walker_nonpart: SQL = `
    SELECT COUNT(*) AS count FROM walkers WHERE participates = 0;
`;

const sql_walker_excused: SQL = `
    SELECT COUNT(*) AS count FROM walkers WHERE participates = 2;
`;

const sql_walker_missed: SQL = `
    SELECT COUNT(*) AS count FROM walkers WHERE participates = 1
    AND distance_m = 0;
`;

const sql_donation_total: SQL = `
    SELECT 
        COUNT(*) AS count, 
        SUM(donation_amount_received) AS sum 
    FROM donations;
`;

const sql_donation_walkers: SQL = `
    SELECT 
        COUNT(*) AS count 
    FROM (SELECT walker_id FROM donations GROUP BY walker_id);
`;

const sql_donation_topay: SQL = `
    SELECT 
        COUNT(*) AS count 
    FROM donations WHERE donation_received = 0;
`;

const sql_distances: SQL = `
    SELECT 
        COUNT(*) AS 'walkers', 
        distance_m FROM walkers 
    GROUP BY distance_m 
    ORDER BY distance_m ASC;
`;


// routes

router.get('/', secure, function(req, res) {

    logger.http('GET api.overview /');

    const esc = (toesc: any | undefined, prop?: string) => {
        if (toesc === undefined) {
            return "--";
        } else if (prop) {
            return toesc[prop];
        } else
            return toesc;
    }

    let count_walker = {
        total: esc(DB().queryFirstCell(sql_walker_total)),
        part: esc(DB().queryFirstCell(sql_walker_part)),
        nonpart: esc(DB().queryFirstCell(sql_walker_nonpart)),
        excused: esc(DB().queryFirstCell(sql_walker_excused)),
        missing: esc(DB().queryFirstCell(sql_walker_missed))
    }

    let distances: { distance_m: number, walkers: number }[];
    distances = DB().query(sql_distances);

    let donation_total = DB().queryFirstRow(sql_donation_total);
    let donations = {
        money: esc(donation_total, "sum"),
        total: esc(donation_total, "count"),
        walker: esc(DB().queryFirstCell(sql_donation_walkers)),
        topay: esc(DB().queryFirstCell(sql_donation_topay))
    }
    res.status(200).json({ success: "success", count_walker, donations, distances });

});