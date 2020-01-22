import winston from 'winston';
import path from 'path';
import config from './config';
//@ts-ignore
import wbs from 'winston-better-sqlite3';
import { ColorizeOptions, TimestampOptions } from 'logform';
import winstonTimestampColorize from 'winston-timestamp-colorize';

let log_path = function(file: string) : string {
    return path.join(__dirname, '..', config.log_folder, file);
}

const color_settigs: ColorizeOptions =  {
    colors: { 
        error : 'red',
        warn : 'yellow',
        info : 'blue',
        http : 'magenta',
        verbose : 'grey',
        debug : 'grey'
    },
    all : true
}

const timestamp_settings: TimestampOptions = {
    format: 'DD-MM-YYYY HH:mm:ss'
}

winston.loggers.add('production', {
    level: 'http',
    transports: [
        new winston.transports.File({
            filename: log_path('server.log'),
            level: 'http',
            format: winston.format.combine(
                winston.format.splat(),
                winston.format.timestamp(),
                winston.format.json()
            )
        }),
        new winston.transports.Console({
            level: 'info',
            format: winston.format.combine(
                winston.format.splat(),
                winston.format.timestamp(timestamp_settings),
                winston.format.colorize(color_settigs),
                winstonTimestampColorize({ color: 'white' }),
                winston.format.printf((info) => `[${info.timestamp}][${info.level}] ${info.message}`)
            )
        }),
        new wbs({
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
                winston.format.timestamp(),
                winston.format.metadata()
            )
        }),
        new winston.transports.Console({ 
            level: 'info',
            format: winston.format.combine(
                winston.format.splat(),
                winston.format.timestamp(timestamp_settings),
                winston.format.colorize(color_settigs),
                winstonTimestampColorize({ color: 'white' }),
                winston.format.printf((info) => `[${info.timestamp}][\033[90;39mdb\033[0;m] ${info.message}`)
            )
        })
    ]


});

winston.loggers.add('debug', {
    level: 'debug',
    transports: [
        new winston.transports.Console({ 
            level: 'debug',
            format: winston.format.combine(
                winston.format.splat(),
                winston.format.timestamp(timestamp_settings),
                winston.format.colorize(color_settigs),
                winstonTimestampColorize({ color: 'white' }),
                winston.format.printf((info) => `[${info.timestamp}][${info.level}] ${info.message}`)
            )
        })
    ]
});