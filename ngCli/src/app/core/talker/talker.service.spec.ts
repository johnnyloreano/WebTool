import { TestBed } from '@angular/core/testing';

import { TalkerService } from './talker.service';

describe('TalkerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TalkerService = TestBed.get(TalkerService);
    expect(service).toBeTruthy();
  });
});
