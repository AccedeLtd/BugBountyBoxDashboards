import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPaymentMethodDialogComponent } from './edit-payment-method-dialog.component';

describe('EditPaymentMethodDialogComponent', () => {
  let component: EditPaymentMethodDialogComponent;
  let fixture: ComponentFixture<EditPaymentMethodDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditPaymentMethodDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPaymentMethodDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
