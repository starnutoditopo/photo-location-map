import { Analytics } from '../../../../src-shared/analytics/analytics';
import { openContainingFolder } from '../../../../src-shared/command/command';
import { Photo } from '../../shared/model/photo.model';
import { photoInfoViewerLogger as logger } from '../photo-info-viewer-logger';

interface MoreOptionsMenuItem {
  text: string;
  onClick: (event: MouseEvent) => void;
}

export function getMoreOptionsMenuItems(photo: Photo): MoreOptionsMenuItem[] {
  const menuItems: MoreOptionsMenuItem[] = [];
  menuItems.push({
    text: 'Open Folder',
    onClick: () => handleOpenFolderMenuItemClicked(photo)
  });

  if (photo.hasGpsInfo) {
    menuItems.push({
      text: 'Open Google Maps',
      onClick: () => handleOpenGoogleMapsMenuItemClicked(photo)
    });
  }

  return menuItems;
}

function handleOpenFolderMenuItemClicked(photo: Photo) {
  logger.info(`Clicked "Open Folder" menu item for ${photo.path}`);
  Analytics.trackEvent('Photo Info Viewer', 'Clicked Open Folder Menu Item');
  openContainingFolder(photo.path);
}

function handleOpenGoogleMapsMenuItemClicked(photo: Photo) {
  logger.info(`Clicked "Open Google Maps" menu item for ${photo.path}`);
  Analytics.trackEvent('Photo Info Viewer', 'Clicked Open Google Maps Menu Item');
  const {latitude, longitude} = photo.exif.gpsInfo.latLng;
  const zoom = 14;
  window.open(
    `https://maps.google.com/?q=${latitude},${longitude}&ll=${latitude},${longitude}&z=${zoom}`
  );
}
