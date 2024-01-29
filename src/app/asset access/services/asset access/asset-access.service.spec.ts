import { TestBed } from '@angular/core/testing';

import { AssetAccessService } from './asset-access.service';

describe('AssetAccessService', () => {
  let service: AssetAccessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssetAccessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
