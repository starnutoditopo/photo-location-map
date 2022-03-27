import { Photo } from '../../shared/model/photo.model';

function getServerUrlStr(): string {
  // Production Server URL
  // const serverUrlStr = 'https://photo-data-viewer-plm.vercel.app/';

  // Production Preview Server URL
  const serverUrlStr = 'https://photo-data-viewer-git-feature-photo-locatio-d5bc15-tomoyukiaota.vercel.app/';

  // Development Server URL
  // const serverUrlStr = 'http://localhost:3000';

  return serverUrlStr;
}

export function getPhotoDataViewerUrl(photo: Photo): string {
  const searchParamsObj = {
    photoPath: photo.path,
  };
  const photoDataViewerUrl = new URL(getServerUrlStr());
  photoDataViewerUrl.search = new URLSearchParams(searchParamsObj).toString();
  return photoDataViewerUrl.href;
}
