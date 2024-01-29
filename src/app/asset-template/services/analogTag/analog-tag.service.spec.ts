import { TestBed } from '@angular/core/testing';

import { AnalogTagService } from './analog-tag.service';

describe('AnalogTagService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AnalogTagService = TestBed.get(AnalogTagService);
    expect(service).toBeTruthy();
  });
});
