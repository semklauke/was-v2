import winston from 'winston';
import path from 'path';
import config from './config';
//@ts-ignore
import wbs from 'winston-better-sqlite3';

let log_path = function(file: string) : string {
    return path.join(__dirname, config.log_folder, file);
}

export let debugLogger = winston.createLogger({
    level: 'debug',
    format: winston.format.combine(
        winston.format.splat(),
        winston.format.timestamp(),
        winston.format.colorize({
            colors: { 
                error: 'red',
                warn: 'orange',
                // info: 'white',
                http: 'blue',
                verbose: 'grey',
                debug: 'grey'
            }
        }),
        winston.format.simple(),
    ),
    transports: [
        new winston.transports.Console({ level: 'debug' })
    ]
});

export let productionLogger = winston.createLogger({
    level: 'http',
    transports: [
        new winston.transports.File({
            filename: log_path('console.log'),
            level: 'http',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            )
        }),
        new winston.transports.Console({
            level: 'info',
            format: winston.format.combine(
                winston.format.splat(),
                winston.format.timestamp(),
                winston.format.colorize({
                    colors: { 
                        error: 'red',
                        warn: 'orange',
                        //info: 'white',
                        http: 'blue'
                    }
                }),
                winston.format.simple()
            )
        })

    ]
});

export let dbLogger = winston.createLogger({
    level: 'debug',
    defaultMeta: { type: 'info', user: 'server', rollback: '' },
    transports: [
        new wbs({
            format: winston.format.json(),
            db: path.join(__dirname, config.db),
            params: ['type', 'message', 'user', 'rollback'],
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
            level: 'debug',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.colorize({
                    colors: { 
                        error: 'pink',
                        warn: 'pink',
                        info: 'pink',
                        http: 'pink',
                        verbose: 'pink',
                        debug: 'pink'
                    }
                }),
                winston.format.simple()
            )
        })
    ]


});
