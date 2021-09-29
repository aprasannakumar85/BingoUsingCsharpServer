import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BingoNewGameComponent } from './bingo-new-game.component';

describe('BingoNewGameComponent', () => {
  let component: BingoNewGameComponent;
  let fixture: ComponentFixture<BingoNewGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BingoNewGameComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BingoNewGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
