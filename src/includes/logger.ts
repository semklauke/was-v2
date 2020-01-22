import winston from 'winston';
import path from 'path';
import config from './config';
//@ts-ignore
import wbs from 'winston-better-sqlite3';
import { ColorizeOptions, TimestampOptions } from 'logform';
import * as winstonConfigTypes from 'winston/lib/winston/config/index';
import winstonTimestampColorize from 'winston-timestamp-colorize';

let obj_empty = function(obj: Object) : boolean {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
}

let log_path = function(file: string) : string {
    return path.join(__dirname, '..', config.log_folder, file);
}

const color_settigs: ColorizeOptions =  {
    colors: { 
        error : 'red',
        warn : 'yellow',
        info : 'blue',
        http : 'magenta',
        app : 'green',
        debug : 'white'
    },
    all : true
}

const level_settings: winstonConfigTypes.AbstractConfigSetLevels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    app: 4,
    debug: 5
}

const timestamp_settings: TimestampOptions = {
    format: 'DD-MM-YYYY HH:mm:ss'
}



winston.loggers.add('production', {
    levels: level_settings,
    level: 'app',
    transports: [
        new winston.transports.File({
            filename: log_path('server.log'),
            level: 'app',
            format: winston.format.combine(
                winston.format.splat(),
                winston.format.timestamp(),
                winston.format.json()
            )
        }),
        new winston.transports.Console({
            level: 'app',
            format: winston.format.combine(
                winston.format.splat(),
                winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'label'] }),
                winston.format.timestamp(timestamp_settings),
                winston.format.colorize(color_settigs),
                winstonTimestampColorize({ color: 'white' }),
                winston.format.printf((info) => {
                    let out: string = `[${info.timestamp}][${info.level}] ${info.message}`;
                    if (!obj_empty(info.metadata)) {
                        let s = JSON.stringify(info.metadata);
                        out += `| ${s}`; 
                    }
                    return out;
                })
            )
        }),
        new wbs({
            level: 'info',
            format: winston.format.combine(
                winston.format.splat(),
                winston.format.json()
            ),
            db: path.join(__dirname, '..', config.db),
            params: ['level', 'message'],
            table_name: 'log',
            id_column_name: 'rec_id'
        }),

    ]
});

winston.loggers.add('db', {
    levels: level_settings,
    level: 'debug',
    defaultMeta: { type: 'empty', user: 'server', rollback: 'null;' },
    transports: [
        new wbs({
            format: winston.format.combine(
                winston.format.splat(),
                winston.format.json()
            ),
            level: 'debug',
            db: path.join(__dirname, '..', config.db),
            params: ['type', 'message', 'user', 'rollback'],
            table_name: 'rollback',
            id_column_name: 'rec_id'    
        }),
        new winston.transports.File({
            filename: log_path('db.log'),
            level: 'debug',
            format: winston.format.combine(
                winston.format.timestamp()
            )
        }),
        /*new winston.transports.Console({ 
            level: 'info',
            format: winston.format.combine(
                winston.format.splat(),
                winston.format.timestamp(timestamp_settings),
                winston.format.colorize(color_settigs),
                winstonTimestampColorize({ color: 'white' }),
                winston.format.printf((info) => {
                    let out: string = `[${info.timestamp}][${info.level}] ${info.message}`;
                    if (info.metadata) console.log(info.metadata); 
                    return out;
                })
            )
        })*/
    ]


});

winston.loggers.add('debug', {
    levels: level_settings,
    level: 'debug',
    transports: [
        new winston.transports.Console({ 
            level: 'debug',
            format: winston.format.combine(
                winston.format.splat(),
                winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'label'] }),
                winston.format.timestamp(timestamp_settings),
                winston.format.colorize(color_settigs),
                winstonTimestampColorize({ color: 'white' }),
                winston.format.printf((info) => {
                    let out: string = `[${info.timestamp}][${info.level}] ${info.message}`;
                    if (!obj_empty(info.metadata)) {
                        let s = JSON.stringify(info.metadata);
                        out += `| ${s}`; 
                    }
                    return out;
                })
            )
        })
    ]
});

