import 'hammerjs';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { Logger } from '../src-shared/log/logger';
import { AppModule } from './app/app.module';
import { AppConfig } from './environments/environment';
import './ipc-renderer-setup/ipc-map-setup';

if (AppConfig.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule, {
    preserveWhitespaces: false
  })
  .catch(err => Logger.error(err));

Logger.info('Content on the main window is loading...');
