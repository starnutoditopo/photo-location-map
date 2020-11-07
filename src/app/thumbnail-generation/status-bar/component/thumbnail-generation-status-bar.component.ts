import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Logger } from '../../../../../src-shared/log/logger';
import { isThumbnailCacheAvailable } from '../../../../../src-shared/thumbnail-cache/thumbnail-cache-util';
import { ThumbnailGenerationService } from '../../service/thumbnail-generation.service';
import { ThumbnailGenerationStatusBarService } from '../service/thumbnail-generation-status-bar.service';

@Component({
  selector: 'app-thumbnail-generation-status-bar',
  templateUrl: './thumbnail-generation-status-bar.component.html',
  styleUrls: ['./thumbnail-generation-status-bar.component.scss']
})
export class ThumbnailGenerationStatusBarComponent implements OnInit {
  public isThumbnailGenerationDone = true;
  public numberOfTotalHeifFiles: number;
  public numberOfThumbnailsUsingCache: number;
  public numberOfThumbnailsGenerationRequired: number;
  public numberOfGeneratedThumbnails: number;

  constructor(private changeDetectorRef: ChangeDetectorRef,
              private thumbnailGenerationService: ThumbnailGenerationService,
              private thumbnailGenerationStatusBarService: ThumbnailGenerationStatusBarService) {
  }

  ngOnInit() {
    this.thumbnailGenerationService.thumbnailGenerationStarted.subscribe(status => {
      this.isThumbnailGenerationDone = false;
      this.numberOfTotalHeifFiles = status.numOfAllHeifFiles;
      this.numberOfThumbnailsGenerationRequired = status.generationRequiredFilePaths.length;
      this.numberOfThumbnailsUsingCache = this.numberOfTotalHeifFiles - this.numberOfThumbnailsGenerationRequired;
      this.numberOfGeneratedThumbnails = 0;
      Logger.info(`Total HEIF/HEIC files: ${ this.numberOfTotalHeifFiles }, Using cache: ${ this.numberOfThumbnailsUsingCache }, `
        + `Generation required: ${ this.numberOfThumbnailsGenerationRequired }`);
      this.updateThumbnailGenerationStatus(status.generationRequiredFilePaths);
    });
  }

  private updateThumbnailGenerationStatus(generationRequiredFilePaths: string[]) {
    const intervalId = setInterval(() => {
      this.numberOfGeneratedThumbnails = generationRequiredFilePaths.filter(filePath => isThumbnailCacheAvailable(filePath)).length;
      Logger.info(`Thumbnail generation progress (generated/generation-required): `
        + `${this.numberOfGeneratedThumbnails}/${this.numberOfThumbnailsGenerationRequired}`);
      if (this.numberOfGeneratedThumbnails === this.numberOfThumbnailsGenerationRequired) {
        this.isThumbnailGenerationDone = true;
        Logger.info(`Completed thumbnail generation.`);
        clearInterval(intervalId);
      }
      this.changeDetectorRef.detectChanges();
    }, 500);
  }

  public handleCloseButtonClicked() {
    this.thumbnailGenerationStatusBarService.closeRequested.next();
  }
}
