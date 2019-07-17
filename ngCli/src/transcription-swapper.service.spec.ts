import { TestBed } from '@angular/core/testing';

import { TranscriptionSwapperService } from './transcription-swapper.service';

describe('TranscriptionSwapperService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TranscriptionSwapperService = TestBed.get(TranscriptionSwapperService);
    expect(service).toBeTruthy();
  });
});
