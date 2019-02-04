import { TestBed } from '@angular/core/testing';

import { TranscripterService } from './transcripter.service';

describe('TranscripterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TranscripterService = TestBed.get(TranscripterService);
    expect(service).toBeTruthy();
  });
});
