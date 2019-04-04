import { TestBed } from '@angular/core/testing';

import { ChartConfiguratorService } from './chart-configurator.service';

describe('ChartConfiguratorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ChartConfiguratorService = TestBed.get(ChartConfiguratorService);
    expect(service).toBeTruthy();
  });
});
