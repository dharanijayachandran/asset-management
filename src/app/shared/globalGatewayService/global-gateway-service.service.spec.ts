import { TestBed } from '@angular/core/testing';

import { GlobalGatewayService } from './global-gateway-service.service';

describe('GlobalGatewayServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GlobalGatewayService = TestBed.get(GlobalGatewayService);
    expect(service).toBeTruthy();
  });
});
