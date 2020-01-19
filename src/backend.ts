import express from 'express';
import sqlite from 'sqlite';
import winston from 'winston';

import config from './includes/config';
import { debugLogger, productionLogger, dbLogger } from './includes/logger';

const logger: winston.Logger = config.debug ? debugLogger : productionLogger;