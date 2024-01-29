import { TestBed } from '@angular/core/testing';

import { AssetTagService } from './asset-tag.service';

describe('AssetTagService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AssetTagService = TestBed.get(AssetTagService);
    expect(service).toBeTruthy();
  });
});
