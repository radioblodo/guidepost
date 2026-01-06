import { TestBed } from '@angular/core/testing';

import { Ml } from './ml';

describe('Ml', () => {
  let service: Ml;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Ml);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
