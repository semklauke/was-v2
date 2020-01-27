/// <reference types="passport"/>
/// <reference types="better-sqlite3"/>

import { PassportStatic } from 'passport';
import { Strategy } from 'passport-local';
import config from './config';
import sqlite from 'better-sqlite3';
import DB from 'better-sqlite3-helper';
import path from 'path';
import uuid from 'uuid/v1';
import winston from 'winston';
import { logger, dbLogger } from './../includes/logger';
import { User, Login } from './../types';
import { RequestHandler } from 'express';
import url from 'url';

export function initAuthentication(pp: PassportStatic) {

    const authStrat: Strategy = new Strategy(function(
                                            username: string, 
                                            password: string, 
                                            done: (error: any, user?: User | boolean) => void) {

        if (password != config.password) {
            logger.warn("Wrong password login from User %s", username);
            return done(null, false);
        }

        let user: User = {
            name : username,
            uuid : uuid(),
            id :  null
        }

        let e: Error | null = null;
        try {
            let newUser: sqlite.Statement = DB().prepare("INSERT INTO logins (name, uuid) VALUES (?, ?)");
            let result: sqlite.RunResult = newUser.run(user.name, user.uuid);
            logger.info("User %s logged in with uuid %s", user.name, user.uuid);
            user.id = <number> result.lastInsertRowid;
            dbLogger.log({
                level: 'app',
                message: 'INSERT new User',
                type: 'INSERT',
                user: user.uuid,
                rb: 'test'
            });
        } catch (error) {
            e = error;
            logger.error("passport authenticate with error ", error);
            dbLogger.log({
                level: 'error',
                message: 'INSERT new User',
                type: 'INSERT',
                user: user.uuid,
                error: error.toString(),
                rb: 'test'
            });
        } finally {
            done(e, user);
        }
    });

    pp.use(authStrat);
    pp.serializeUser(function(user: User, done: (err: any, id?: number) => void){
        if (!user.id) {
            logger.error("passport.serializeUser no user object with user", user);
            done(new Error("passport.serializeUser no user object with user " + JSON.stringify(user)));
        } else {
            logger.debug("passport.serializeUser %s", user.name);
            done(null, user.id);
        }
    });
    pp.deserializeUser(function(id: number, done: (err: any, user?: User | null) => void) {
        
        let u: User | null = null;
        let e: Error | null = null;

        try {
            let result: Login | undefined = DB().prepare("SELECT * FROM logins WHERE rec_id = ?").get(id); 
            if (!result) {
                logger.error("passport.deserializeUser no user for id %d", id);
                e = new Error("passport.deserializeUser no user for id");
            } else {
                logger.debug("passport.deserializeUser %s", result.name);
                u = {
                    name: result.name,
                    uuid: result.uuid,
                    id
                };
            }
        } catch (error) {
            logger.error("DB ERROR | SELECT * FROM logins WHERE rec_id = %d", id);
            if (e === null ) e = new Error("passport.deserializeUser db error");
        } finally {
            done(e, u);
        }
    });

}

export let secure: RequestHandler = function(req, res, next)  {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect(url.format({
            pathname: "/login",
            query: {
                info: 'l'
            }
        }));
    }
}