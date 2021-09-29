import { TestBed } from '@angular/core/testing';

import { NewGameService } from './newgame.service';

describe('NewgameService', () => {
  let service: NewGameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewGameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
