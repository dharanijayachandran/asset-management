import { TestBed } from '@angular/core/testing';

import { AssetSharedService } from './asset-shared.service';

describe('AssetSharedService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AssetSharedService = TestBed.get(AssetSharedService);
    expect(service).toBeTruthy();
  });
});
