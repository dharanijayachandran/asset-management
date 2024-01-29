import { TestBed } from '@angular/core/testing';

import { GatewayTemplateService } from './gateway-template.service';

describe('GatewayTemplateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GatewayTemplateService = TestBed.get(GatewayTemplateService);
    expect(service).toBeTruthy();
  });
});
