import { TestBed } from '@angular/core/testing';

import { HttpPdbRequesterService } from './http-pdb-requester.service';

describe('HttpPdbRequesterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HttpPdbRequesterService = TestBed.get(HttpPdbRequesterService);
    expect(service).toBeTruthy();
  });
});
