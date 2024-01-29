import { TestBed } from '@angular/core/testing';

import { AlarmConfigService } from './alarm-config.service';

describe('AlarmConfigService', () => {
  let service: AlarmConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlarmConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
