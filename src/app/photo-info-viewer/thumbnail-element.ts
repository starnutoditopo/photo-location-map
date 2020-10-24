import * as fs from 'fs';
import * as os from 'os';
import { Analytics } from '../../../src-shared/analytics/analytics';
import { FilenameExtension } from '../../../src-shared/filename-extension/filename-extension';
import { getThumbnailFilePath } from '../../../src-shared/thumbnail/get-thumbnail-file-path';
import { Logger } from '../../../src-shared/log/logger';
import { IconDataUrl } from '../../assets/icon-data-url';
import { Dimensions } from '../shared/model/dimensions.model';
import { Photo } from '../shared/model/photo.model';
import { PhotoViewerLauncher } from '../photo-viewer/photo-viewer-launcher';

export class ThumbnailElement {
  public static create(photo: Photo): { thumbnailElement: HTMLImageElement; thumbnailContainerElement: HTMLDivElement } {
    const thumbnailElement = this.createThumbnailElement(photo);
    const thumbnailContainerElement = this.createThumbnailContainerElement(thumbnailElement);
    return { thumbnailElement, thumbnailContainerElement };
  }

  private static createThumbnailElement(photo: Photo) {
    const thumbnailElement = document.createElement('img');

    const isThumbnailAvailableFromExif = photo.exif.thumbnail;
    const isPhotoDisplayableInBrowser = FilenameExtension.isDisplayableInBrowser(photo.filenameExtension);
    const isThumbnailGenerationAvailable = FilenameExtension.isThumbnailGenerationAvailable(photo.filenameExtension);

    if (isThumbnailAvailableFromExif) {
      this.displayThumbnailFromExif(thumbnailElement, photo);
    } else if (isPhotoDisplayableInBrowser) {
      this.displayThumbnailUsingPhotoItself(thumbnailElement, photo);
    } else if (isThumbnailGenerationAvailable) {
      this.displayGeneratedThumbnail(thumbnailElement, photo);
    } else {
      this.displayNoThumbnailAvailableImage(thumbnailElement, photo);
    }

    thumbnailElement.style.transition = 'transform 0.3s ease-in-out';
    thumbnailElement.onclick = () => this.handleThumbnailClick(photo);
    return thumbnailElement;
  }

  private static displayThumbnailFromExif(thumbnailElement: HTMLImageElement, photo: Photo) {
    thumbnailElement.src = photo.exif.thumbnail.dataUrl;
    thumbnailElement.width = photo.exif.thumbnail.dimensions.width;
    thumbnailElement.height = photo.exif.thumbnail.dimensions.height;
    thumbnailElement.title = `Click the thumbnail to open ${photo.name}`;
  }

  // 259 comes from MAX_PATH (i.e. 260) minus the terminating null character.
  // See https://stackoverflow.com/a/1880453/7947548
  private static maxPathLengthOnWindows = 259;

  private static displayThumbnailUsingPhotoItself(thumbnailElement: HTMLImageElement, photo: Photo) {
    this.displayThumbnailUsingFile(thumbnailElement, photo, photo.path);
    this.handlePathTooLongCaseOnWindowsWhenUsingPhotoForThumbnail(thumbnailElement, photo);
  }

  private static displayGeneratedThumbnail(thumbnailElement: HTMLImageElement, photo: Photo) {
    const intervalId = setInterval(() => {
      const { thumbnailFilePath } = getThumbnailFilePath(photo.path);
      const thumbnailFileExists = fs.existsSync(thumbnailFilePath);
      if (thumbnailFileExists) {
        this.displayThumbnailUsingFile(thumbnailElement, photo, thumbnailFilePath);
        this.handlePathTooLongCaseOnWindowsForGeneratedThumbnail(thumbnailElement, photo, thumbnailFilePath);
        clearInterval(intervalId);
      } else {
        this.displayGeneratingThumbnailImage(thumbnailElement, photo);
      }
    }, 1000);
  }

  private static handlePathTooLongCaseOnWindowsWhenUsingPhotoForThumbnail(thumbnailElement: HTMLImageElement, photo: Photo) {
    if (os.platform() === 'win32' && photo.path.length > this.maxPathLengthOnWindows) {
      thumbnailElement.alt = `Thumbnail cannot be displayed because the length of the file path is ${photo.path.length}. `
        + `Windows restricts the maximum path length to ${this.maxPathLengthOnWindows}. Please change file location to shorten the path of the file. `
        + `For details, press Ctrl+Shift+I and read the console messages.`;
      Logger.warn(`\n`
        + `Thumbnail of ${photo.name} cannot be displayed because the length of the file path exceeds the maximum.\n`
        + `Please change the location of ${photo.name} to shorten the path.\n`
        + `-------------------------------\n`
        + `Maximum file path length: ${this.maxPathLengthOnWindows}\n`
        + `File path length of ${photo.name}: ${photo.path.length}\n`
        + `-------------------------------\n`
        + `File path of ${photo.name} is "${photo.path}"\n`
      );
    }
  }

  private static handlePathTooLongCaseOnWindowsForGeneratedThumbnail(thumbnailElement: HTMLImageElement, photo: Photo, thumbnailFilePath: string) {
    if (os.platform() === 'win32' && thumbnailFilePath.length > this.maxPathLengthOnWindows) {
      thumbnailElement.alt = `Thumbnail cannot be displayed because the length of the file path of the generated thumbnail is ${thumbnailFilePath.length}. `
                           + `Windows restricts the maximum path length to ${this.maxPathLengthOnWindows}. Please change file location to shorten the path of the generated thumbnail. `
                           + `For details, press Ctrl+Shift+I and read the console messages.`;
      Logger.warn(`\n`
                + `Thumbnail of ${photo.name} cannot be displayed because the length of the file path of the generated thumbnail exceeds the maximum.\n`
                + `Please change the location of ${photo.name} to shorten the path of the generated thumbnail.\n`
                + `-------------------------------\n`
                + `Maximum file path length: ${this.maxPathLengthOnWindows}\n`
                + `File path length of ${photo.name}: ${photo.path.length}\n`
                + `File path length of generated thumbnail: ${thumbnailFilePath.length}\n`
                + `-------------------------------\n`
                + `File path of ${photo.name} is "${photo.path}"\n`
                + `-------------------------------\n`
                + `File path of generated thumbnail is "${thumbnailFilePath}"\n`
      );
    }
  }

  private static minThumbnailContainerSquareSideLength = 200;

  private static displayThumbnailUsingFile(thumbnailElement: HTMLImageElement, photo: Photo, thumbnailFilePath: string) {
    // # needs to be escaped. See https://www.w3schools.com/tags/ref_urlencode.asp for encoding.
    const escapedPath = thumbnailFilePath.replace(/#/g, '%23');
    thumbnailElement.src = `file://${escapedPath}`;
    const largerSideLength = this.minThumbnailContainerSquareSideLength;
    if (photo.exif.imageDimensions.width > photo.exif.imageDimensions.height) {
      thumbnailElement.width = largerSideLength;
      thumbnailElement.height = largerSideLength * (photo.exif.imageDimensions.height / photo.exif.imageDimensions.width);
    } else {
      thumbnailElement.width = largerSideLength * (photo.exif.imageDimensions.width / photo.exif.imageDimensions.height);
      thumbnailElement.height = largerSideLength;
    }
    thumbnailElement.title = `Click the thumbnail to open ${photo.name}`;
  }

  private static displayGeneratingThumbnailImage(thumbnailElement: HTMLImageElement, photo: Photo) {
    thumbnailElement.width = 150;
    thumbnailElement.height = 15;
    thumbnailElement.src = IconDataUrl.generatingThumbnail;
    thumbnailElement.title = `Generating thumbnail for ${photo.name}.`;
  }

  private static displayNoThumbnailAvailableImage(thumbnailElement: HTMLImageElement, photo: Photo) {
    thumbnailElement.width = 150;
    thumbnailElement.height = 15;
    thumbnailElement.src = IconDataUrl.noThumbnailAvailable;
    thumbnailElement.title = `Thumbnail is not available for ${photo.name}.`;
  }

  private static handleThumbnailClick(photo: Photo): void {
    Logger.info(`Photo Info Viewer: Clicked the thumbnail of ${photo.path}`);
    Analytics.trackEvent('Photo Info Viewer', 'Clicked Thumbnail');
    PhotoViewerLauncher.launch(photo);
  }

  private static createThumbnailContainerElement(thumbnailElement: HTMLImageElement) {
    const thumbnailContainer = document.createElement('div');
    thumbnailContainer.style.display = 'flex';
    thumbnailContainer.style.justifyContent = 'center';
    thumbnailContainer.style.alignItems = 'center';
    const thumbnailContainerDimensions = new Dimensions(thumbnailElement.width, thumbnailElement.height).expandToSquare();
    thumbnailContainer.style.width = thumbnailContainerDimensions.width.toString() + 'px';
    thumbnailContainer.style.minWidth = `${this.minThumbnailContainerSquareSideLength}px`;
    thumbnailContainer.style.height = thumbnailContainerDimensions.height.toString() + 'px';
    thumbnailContainer.style.minHeight = `${this.minThumbnailContainerSquareSideLength}px`;

    thumbnailContainer.appendChild(thumbnailElement);
    return thumbnailContainer;
  }
}
