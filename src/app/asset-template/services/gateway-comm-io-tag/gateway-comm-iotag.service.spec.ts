import { TestBed } from '@angular/core/testing';

import { GatewayCommIOTagService } from './gateway-comm-iotag.service';

describe('GatewayCommIOTagService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GatewayCommIOTagService = TestBed.get(GatewayCommIOTagService);
    expect(service).toBeTruthy();
  });
});
