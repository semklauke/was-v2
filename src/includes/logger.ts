import { WasLogger } from './../types';
import config from './config';
import winston from 'winston';

export const logger: WasLogger = config.debug 
    ? <WasLogger>winston.loggers.get('debug') 
    : <WasLogger>winston.loggers.get('production');
export const dbLogger: WasLogger = <WasLogger> winston.loggers.get('db');