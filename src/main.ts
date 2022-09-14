import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { initializeGtag } from '../src-shared/analytics/initialize-gtag';
import { Logger } from '../src-shared/log/logger';
import { LogFileConfig } from '../src-shared/log/log-file-config';
import { AppModule } from './app/app.module';
import { AppConfig } from './environments/environment';
import './ipc-renderer-setup/ipc-renderer-all-setup';

if (AppConfig.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule, {
    preserveWhitespaces: false
  })
  .catch(err => Logger.error(err));

Logger.info('Content on the main window is loading...');
Logger.info(`Log File Location: ${LogFileConfig.filePath}`);

initializeGtag();
