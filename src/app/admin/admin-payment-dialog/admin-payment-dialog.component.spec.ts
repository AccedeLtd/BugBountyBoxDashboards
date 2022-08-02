import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPaymentDialogComponent } from './admin-payment-dialog.component';

describe('AdminPaymentDialogComponent', () => {
  let component: AdminPaymentDialogComponent;
  let fixture: ComponentFixture<AdminPaymentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminPaymentDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPaymentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
