import { TestBed } from '@angular/core/testing';

import { AssetTemplateService } from './asset-template.service';

describe('AssetTemplateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AssetTemplateService = TestBed.get(AssetTemplateService);
    expect(service).toBeTruthy();
  });
});
