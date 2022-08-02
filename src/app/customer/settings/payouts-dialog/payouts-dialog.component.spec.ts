import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayoutsDialogComponent } from './payouts-dialog.component';

describe('PayoutsDialogComponent', () => {
  let component: PayoutsDialogComponent;
  let fixture: ComponentFixture<PayoutsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayoutsDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayoutsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
