import { app, dialog } from 'electron';
import { autoUpdater, UpdateInfo } from 'electron-updater';
import { DevOrProd } from '../../src-shared/dev-or-prod/dev-or-prod';
import { mainWindow } from '../electron-main';
import { AutoUpdateLogger } from './auto-update-logger';

autoUpdater.logger = AutoUpdateLogger;

autoUpdater.on('download-progress', progress => {
  const progressPercentage = `Download progress: ${progress.percent.toFixed(1)}%`;
  const transferredOutOfTotal = `Downloaded ${progress.transferred} bytes out of ${progress.total} bytes`;
  const downloadSpeed = `Download speed: ${progress.bytesPerSecond} B/s`;
  const message = `${progressPercentage}, ${transferredOutOfTotal}, ${downloadSpeed}.`;
  AutoUpdateLogger.info(message);
});

const createMessageForMessageBox = (info: UpdateInfo) => {
  return `A new version of Photo Location Map is available and will be installed after restart.
Do you want to restart this application now?

Current version: ${app.getVersion()}
Latest version: ${info.version}`;
};

autoUpdater.on('update-downloaded', (info: UpdateInfo) => {
  dialog.showMessageBox(mainWindow, {
    title: 'A new version of Photo Location Map is available!',
    type: 'info',
    message: createMessageForMessageBox(info),
    buttons: ['Yes', 'No'],
  }).then(result => {
    const yes = result.response === 0;
    AutoUpdateLogger.info(`User clicked "${yes ? 'Yes' : 'No'}" on the dialog to restart this application to install a new version ${info.version}.`);
    if (yes) {
      autoUpdater.quitAndInstall(true, true);
    }
  });
});

app.on('ready', async () => {
  if (DevOrProd.isDev) {
    AutoUpdateLogger.info(`autoUpdater.checkForUpdates() is skipped in development environment.`);
    return;
  }

  await autoUpdater.checkForUpdates().catch(reason => {
    AutoUpdateLogger.warn(`Promise from autoUpdater.checkForUpdates() is rejected. ${reason}`);
  });
});
