// -- class api route --

/// <reference types="better-sqlite3"/>

import express from 'express';
import { secure, secureFrontend } from './../authentication';
import sqlite from 'better-sqlite3';
import DB from 'better-sqlite3-helper';
import bodyParser from 'body-parser';
import { logger, dbLogger } from './../logger';
import { Walker, Donation, SQL, ClassRender, WalkerRender, DonationRender } from './../../types';
import { round, courseToString, getNameFunction, Course } from './../helper';

// init router
export const router: express.Router = express.Router();

// sql querys

const sql_walker_for_class: SQL = `
    SELECT * FROM walkers WHERE class LIKE ? ORDER BY lastname, firstname
`;

const sql_donation_for_walker: SQL = `
    SELECT * FROM donations WHERE walker_id = ?
`;

const sql_walker_for_class_for_course: SQL = `
    SELECT * FROM walkers WHERE class LIKE ? AND course = ? ORDER BY lastname, firstname
`;

// routes

router.get('/:class_ident', secureFrontend, function(req, res) {

    let class_ident: string = req.params.class_ident.toUpperCase();
    logger.http('GET api.class /%s (:class_ident)', class_ident);

    let data: ClassRender = {
        class: class_ident,
        walker: [],
        sum: 0
    };

    let walkerStmt: sqlite.Statement = DB().prepare(sql_walker_for_class);
    let donationStmt: sqlite.Statement = DB().prepare(sql_donation_for_walker);
    for (let w of walkerStmt.iterate("%"+class_ident)) {
        let tmpw: Walker = <Walker>w;
        let wr: WalkerRender = {
            sum: 0,
            donations: [],
            rec_id: tmpw.rec_id,
            class: tmpw.class,
            distance_m: tmpw.distance_m,
            lastname: tmpw.lastname,
            firstname: tmpw.firstname,
            participates: tmpw.participates,
            getName: getNameFunction
        };

        let wd: Donation[] = donationStmt.all(tmpw.rec_id);
        for (let d of wd) {
            let sum: number = round((tmpw.distance_m/1000) * d.donation_each_km);
            wr.sum += sum;
            wr.donations.push({
                rec_id: d.rec_id,
                donation_each_km: d.donation_each_km,
                firstname: d.firstname,
                lastname: d.lastname,
                sum,
                getName: getNameFunction
            });
        }
        data.sum += wr.sum;
        data.walker.push(wr);
    }

    res.render('class', data);
});

router.get('/:class_ident/:course', secureFrontend, function(req, res) {

    let class_ident: string = req.params.class_ident.toUpperCase();
    let course: string = req.params.course.toUpperCase();
    logger.http('GET api.class /%s/%s (:class_ident/:course)', class_ident, course);

    let class_title: string = class_ident+" ("+courseToString(course)+")";
    let data: ClassRender = {
        class: class_title,
        walker: [],
        sum: 0
    };

    let walkerStmt: sqlite.Statement = DB().prepare(sql_walker_for_class_for_course);
    let donationStmt: sqlite.Statement = DB().prepare(sql_donation_for_walker);
    for (let w of walkerStmt.iterate("%"+class_ident, course)) {
        let tmpw: Walker = <Walker>w;
        let wr: WalkerRender = {
            sum: 0,
            donations: [],
            rec_id: tmpw.rec_id,
            class: tmpw.class,
            distance_m: tmpw.distance_m,
            lastname: tmpw.lastname,
            firstname: tmpw.firstname,
            participates: tmpw.participates,
            getName: getNameFunction
        };

        let wd: Donation[] = donationStmt.all(tmpw.rec_id);
        for (let d of wd) {
            let sum: number = round((tmpw.distance_m/1000) * d.donation_each_km);
            wr.sum += sum;
            wr.donations.push({
                rec_id: d.rec_id,
                donation_each_km: d.donation_each_km,
                firstname: d.firstname,
                lastname: d.lastname,
                sum,
                getName: getNameFunction
            });
        }
        data.sum += wr.sum;
        data.walker.push(wr);
    }

    res.render('class', data);
});