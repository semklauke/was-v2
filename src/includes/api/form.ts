// -- form api route --

/// <reference types="better-sqlite3"/>

import express from 'express';
import {secureFrontend, securePost } from './../authentication';
import sqlite from 'better-sqlite3';
import DB from 'better-sqlite3-helper';
import bodyParser from 'body-parser';
import { logger, dbLogger } from './../logger';
import { Walker, Donation, SQL } from './../../types';
import { round, courseToString, SpellNumber, getNameFunction, Course } from './../helper';
import config from './../../includes/config';

// init router
export const router: express.Router = express.Router();

//
function numberToSringDE(x: number) : string {
    if (x === 0 || x === 0.0 || x == 0 || x == 0.0)
        return "Null Euro";
    let vor_komma: SpellNumber = new SpellNumber(Math.floor(x));
    let s: string = vor_komma.spell() + " Euro";
    if (x - Math.floor(x) > 0) {
        let nach_komma: SpellNumber = new SpellNumber(Math.round((x-Math.floor(x))*100));
        s += " und " + nach_komma.spell() + " Cent";
    }
    return s;
}

const money_threshold: number = 0.0;

// sql querys
const sql_donations: SQL = `
    SELECT 
        walkers.rec_id AS walker_rec_id, 
        walkers.firstname AS walker_firstname,
        walkers.lastname AS walker_lastname,
        walkers.distance_m AS walker_distance_m,
        d.donation_amount_received AS donation_amount_received,
        d.donation_each_km AS donation_each_km,
        d.zipcode AS zipcode, 
        d.city AS city, 
        d.address AS address, 
        d.firstname AS firstname, 
        d.lastname AS lastname 
    FROM donations AS d 
    LEFT JOIN walkers 
        ON d.walker_id = walkers.rec_id 
    WHERE 
        d.needs_donation_receipt = 1 
        AND donation_received = 1 
        AND walkers.class LIKE ? 
    ORDER BY walkers.lastname, walkers.firstname, d.lastname, d.firstname 
`;

const sql_donations_course: SQL = `
    SELECT 
        walkers.rec_id AS walker_rec_id, 
        walkers.firstname AS walker_firstname,
        walkers.lastname AS walker_lastname,
        walkers.distance_m AS walker_distance_m,
        d.donation_amount_received AS donation_amount_received,
        d.donation_each_km AS donation_each_km,
        d.zipcode AS zipcode, 
        d.city AS city, 
        d.address AS address, 
        d.firstname AS firstname, 
        d.lastname AS lastname 
    FROM donations AS d 
    LEFT JOIN walkers 
        ON d.walker_id = walkers.rec_id 
    WHERE 
        d.needs_donation_receipt = 1 
        AND donation_received = 1 
        AND walkers.class LIKE ? 
        AND walkers.course = ? 
    ORDER BY walkers.lastname, walkers.firstname, d.lastname, d.firstname 
`;

// interface
type FormWalker = {
    name: string,
    donations: string[],
};

type Form = {
    firstname: string,
    lastname: string,
    address: string,
    money: number,
    moneyWord: string,
    payDate: string,
    printDate: string,
    getName?: (this: Form) => string
};

// routes

router.get('/:class_ident', securePost, function(req, res) {

    let class_ident: string = req.params.class_ident.toUpperCase();
    logger.http('GET api.form /%s (:class_ident)', class_ident);

    let title: string = "Spenden Quittungen Klasse "+class_ident;
    let data = {
        title,
        walker: new Array<FormWalker>(),
        forms: new Array<Form>(),
        pdf: false
    };

    let walker_id: number = -1;
    let counter: number = -1;

    let donationStmt: sqlite.Statement = DB().prepare(sql_donations);
    for (let d of donationStmt.iterate("%"+class_ident)) {
        let money: number = round(parseFloat(d.donation_amount_received)); 
        if (money >= money_threshold) {
            let printDate: string;
            if (config.print_date == null) {
                let today: Date = new Date();
                printDate = [today.getDate(), today.getMonth() + 1, today.getFullYear()].join(".");
            } else {
                //@ts-ignore
                printDate = config.print_date;
            }

            let form: Form = {
                firstname: d.firstname,
                lastname: d.lastname,
                address: (d.zipcode+" "+d.city+" "+d.address),
                money,
                payDate: config.pay_date,
                printDate,
                moneyWord: numberToSringDE(money),
                getName: getNameFunction
            };

            if (parseInt(d.walker_rec_id) != walker_id) {
                walker_id = parseInt(d.walker_rec_id);
                counter++;
                data.walker.push({
                    name: d.walker_firstname + " " + d.walker_lastname,
                    donations: new Array<string>()
                });
            }
            data.walker[counter].donations.push(d.firstname+" "+d.lastname+" ("+money+")");
            data.forms.push(form);
        }
    }
    
    res.render('form', data);

});

router.get('/:class_ident/:course', securePost, function(req, res) {

    let class_ident: string = req.params.class_ident.toUpperCase();
    let course: string = req.params.course.toUpperCase();
    logger.http('GET api.form /%s/%s (:class_ident/:course)', class_ident, course);

    let title: string = "Spenden Quittungen "+class_ident+" ("+courseToString(course)+")";
    let data = {
        title,
        walker: new Array<FormWalker>(),
        forms: new Array<Form>(),
        pdf: false
    };

    let walker_id: number = -1;
    let counter: number = -1;

    let donationStmt: sqlite.Statement = DB().prepare(sql_donations_course);
    for (let d of donationStmt.iterate("%"+class_ident, course)) {
        let money: number = round(parseFloat(d.donation_amount_received)); 
        if (money >= money_threshold) {
            let printDate: string;
            if (config.print_date == null) {
                let today: Date = new Date();
                printDate = [today.getDate(), today.getMonth() + 1, today.getFullYear()].join(".");
            } else {
                //@ts-ignore
                printDate = config.print_date;
            }

            let form: Form = {
                firstname: d.firstname,
                lastname: d.lastname,
                address: (d.zipcode+" "+d.city+" "+d.address),
                money,
                payDate: config.pay_date,
                printDate,
                moneyWord: numberToSringDE(money),
                getName: getNameFunction
            };

            if (parseInt(d.walker_rec_id) != walker_id) {
                walker_id = parseInt(d.walker_rec_id);
                counter++;
                data.walker.push({
                    name: d.walker_firstname + " " + d.walker_lastname,
                    donations: new Array<string>()
                });
            }
            data.walker[counter].donations.push(d.firstname+" "+d.lastname+" ("+money+")");
            data.forms.push(form);
        }
    }

    res.render('form', data);
});