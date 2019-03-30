/* tslint:disable:no-console */

console.log('before imports');

import * as os from 'os';
// import * as fs from 'fs-extra';
// tslint:disable-next-line:prefer-const
let fs: any;
import * as moment from 'moment-timezone';
import { LogFileConfig } from './log-file-config';
import { ProcessIdentifier } from './process-identifier';
import { EnvironmentDetector } from './environment-detector';

console.log('after imports');


class LoggerImpl {
    private static fileSystem: typeof fs | 'unavailable';

    public static initialize() {
        if (ProcessIdentifier.isElectron()) {
            if (ProcessIdentifier.isElectronMain()) {
                LogFileConfig.setup('./log', `${this.dateTimeInBasicFormat()}_photo-location-map_log.txt`);
                fs.ensureFileSync(LogFileConfig.filePath);
                this.fileSystem = fs;
            } else {
                this.fileSystem = window.require('electron').remote.require('fs');
            }
        }
    }

    private static dateTimeInBasicFormat() {
        return moment.utc().format('YYYYMMDDTHHmmss.SSS[Z]');
    }

    private static dateTimeInExtendedFormat() {
        return moment.utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
    }

    public static generateLogText(message: string, level: string): string {
        const dateTime = this.dateTimeInExtendedFormat();
        const processType = ProcessIdentifier.processType();
        return `[${dateTime}] [${processType}] [${level}] ${message}`;
    }

    public static appendToLogFile(message: string, ...object: any) {
        if (EnvironmentDetector.isTest())
            return;

        if (this.fileSystem === undefined || this.fileSystem === 'unavailable') {
            // Do nothing because File System API is not avaialble.
        } else {
            this.fileSystem.appendFile(LogFileConfig.filePath, message + os.EOL, (err) => {
                if (err) throw err;
            });
        }
    }
}

LoggerImpl.initialize();

export class Logger {
    public static error(message: string, ...object: any) {
        const text = LoggerImpl.generateLogText(message, 'error');
        console.error(text, ...object);
        LoggerImpl.appendToLogFile(text, ...object);
    }

    public static warn(message: string, ...object: any) {
        const text = LoggerImpl.generateLogText(message, 'warn');
        console.warn(text, ...object);
        LoggerImpl.appendToLogFile(text, ...object);
    }

    public static info(message: string, ...object: any) {
        const text = LoggerImpl.generateLogText(message, 'info');
        console.info(text, ...object);
        LoggerImpl.appendToLogFile(text, ...object);
    }

    public static debug(message: string, ...object: any) {
        const text = LoggerImpl.generateLogText(message, 'debug');
        console.debug(text, ...object);
        LoggerImpl.appendToLogFile(text, ...object);
    }
}
