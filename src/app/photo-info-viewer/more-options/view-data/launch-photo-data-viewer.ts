import { BrowserWindow } from '@electron/remote';
import { Photo } from '../../../shared/model/photo.model';
import { PhotoDataViewerWindowState } from './photo-data-viewer-window-state';
import { getPhotoDataViewerUrl } from './photo-data-viewer-url';

export async function launchPhotoDataViewer(photo: Photo) {
  const windowState = PhotoDataViewerWindowState.get();

  const browserWindow = new BrowserWindow({
    x: windowState.x,
    y: windowState.y,
    width: windowState.width,
    height: windowState.height,
    title: `${photo.name} - Photo Location Map`,  // Needs to be the same as document.title in Photo Data Viewer.
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  PhotoDataViewerWindowState.manage(browserWindow);

  const photoDataViewerUrl = getPhotoDataViewerUrl(photo);
  await browserWindow.loadURL(photoDataViewerUrl);
  browserWindow.show();
}
