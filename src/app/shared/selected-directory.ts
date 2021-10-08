import * as pathModule from 'path';
import * as createDirectoryTree from 'directory-tree';
import { FilenameExtension } from '../../../src-shared/filename-extension/filename-extension';
import { convertToFlattenedDirTree } from '../../../src-shared/dir-tree/dir-tree-util';

export class SelectedDirectory {
  private static excludeRegexArray: RegExp[] = [
    // Notes:
    // - The purpose of regex is to exclude the hidden files/folders.
    // - Regex should be as specific as possible in order not to accidentally exclude visible files/folders.
    // - Regex begins from [\/\\] (/ or \ for path separator) to be sure of the beginning of a file/folder name.
    // - For files, $ is placed at the end to be sure of specifying file paths.
    // - Using i flag to ignore case. e.g. both $RECYCLE.BIN and $Recycle.Bin exist.

    // Windows
    /[\/\\]\$Recycle\.Bin/i,
    /[\/\\]desktop\.ini$/i,
    /[\/\\]Thumbs\.db$/i,

    // Mac - Anywhere
    /[\/\\]\._.*/,
    /[\/\\]\.AppleDouble/i,
    /[\/\\]\.DS_Store$/i,
    /[\/\\]\.localized$/i,
    /[\/\\]__MACOSX/i,

    // Mac - Root of a Volume
    /[\/\\]\.apdisk$/i,
    /[\/\\]\.com\.apple\.timemachine\.donotpresent$/i,
    /[\/\\]\.DocumentRevisions-V100/i,
    /[\/\\]\.fseventsd/i,
    /[\/\\]\.Spotlight-V100/i,
    /[\/\\]\.TemporaryItems/i,
    /[\/\\]\.Trashes/i,
    /[\/\\]\.VolumeIcon\.icns/i,
  ];

  private static movFilePaths: string[] = [];

  public static createDirectoryTree(selectedDirPath: string) {
    const dirTree = createDirectoryTree(selectedDirPath, {exclude: this.excludeRegexArray});
    const flattenedDirTree = convertToFlattenedDirTree(dirTree);
    this.movFilePaths = flattenedDirTree
      .filter(element => FilenameExtension.isMov(element.extension))
      .map(element => element.path.toLowerCase());
    return dirTree;
  }

  public static getLivePhotosFilePathIfAvailable(photoFilePath: string) {
    const parsedPath = pathModule.parse(photoFilePath);
    const livePhotosFilePath = pathModule.join(parsedPath.dir, parsedPath.name + '.MOV').toLowerCase();
    const livePhotosAvailable = this.movFilePaths.includes(livePhotosFilePath);
    return {livePhotosAvailable, livePhotosFilePath};
  }
}
