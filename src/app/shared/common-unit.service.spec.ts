import { TestBed } from '@angular/core/testing';

import { CommonUnitService } from './common-unit.service';

describe('CommonUnitService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CommonUnitService = TestBed.get(CommonUnitService);
    expect(service).toBeTruthy();
  });
});
