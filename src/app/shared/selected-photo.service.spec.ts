import { TestBed } from '@angular/core/testing';

import { SelectedPhotoService } from './selected-photo.service';

describe('SelectedPhotoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SelectedPhotoService = TestBed.get(SelectedPhotoService);
    expect(service).toBeTruthy();
  });
});
