import { TestBed } from '@angular/core/testing';

import { DiscreteTagService } from './discrete-tag.service';

describe('DiscreteTagService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DiscreteTagService = TestBed.get(DiscreteTagService);
    expect(service).toBeTruthy();
  });
});
