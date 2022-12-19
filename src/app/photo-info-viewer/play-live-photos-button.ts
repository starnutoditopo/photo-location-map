import { Analytics } from '../../../src-shared/analytics/analytics';
import { openWithAssociatedApp } from '../../../src-shared/command/command';
import { IconDataUrl } from '../../assets/icon-data-url';
import { Photo } from '../shared/model/photo.model';
import { SelectedDirectory } from '../shared/selected-directory';
import { createPhotoInfoViewerButton } from "./photo-info-viewer-button";
import { photoInfoViewerLogger as logger } from './photo-info-viewer-logger';


export class PlayLivePhotosButton {
  public static create(photo: Photo): HTMLButtonElement {
    const {livePhotosAvailable, livePhotosFilePath} = SelectedDirectory.getLivePhotosFilePathIfAvailable(photo.path);
    if (!livePhotosAvailable)
      return null;

    const onClick = () => this.handleButtonClick(livePhotosFilePath, photo);
    const button = createPhotoInfoViewerButton(onClick, IconDataUrl.play, 'Live Photos');
    return button;
  }

  private static handleButtonClick(livePhotosFilePath: string, photo: Photo): void {
    logger.info(`Clicked the play live photos button for ${photo.path}`);
    Analytics.trackEvent('Photo Info Viewer', '[PIV] Clicked Play Live Photos Button');
    openWithAssociatedApp(livePhotosFilePath);
  }
}
