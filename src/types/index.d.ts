import { Logger, LeveledLogMethod } from 'winston';

interface WasLogger extends Logger {
    app: LeveledLogMethod;
}