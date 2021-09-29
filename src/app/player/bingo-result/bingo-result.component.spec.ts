import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BingoResultComponent } from './bingo-result.component';

describe('BingoResultComponent', () => {
  let component: BingoResultComponent;
  let fixture: ComponentFixture<BingoResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BingoResultComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BingoResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
