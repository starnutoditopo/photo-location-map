import { Photo } from './photo.model';
import { Dimensions } from './dimensions.model';
import * as imageRotator from './../image-rotator';

export class Thumbnail {
  private constructor(public readonly dataUrl: string,
                      public readonly dimensions: Dimensions) {
  }

  public static async create(photo: Photo): Promise<Thumbnail> {
    const exif = photo.exifParserResult;
    if (exif === null || !exif.hasThumbnail('image/jpeg'))
      return null;

    const buffer = exif.getThumbnailBuffer();
    const base64String = btoa(String.fromCharCode.apply(null, buffer));
    const dataUrl = `data:image/jpg;base64,${base64String}`;
    const rotated = await imageRotator.correctRotation(dataUrl, exif.tags.Orientation);
    const rotatedDimensions = new Dimensions(rotated.width, rotated.height);
    return new Thumbnail(rotated.dataUrl, rotatedDimensions);
  }
}
