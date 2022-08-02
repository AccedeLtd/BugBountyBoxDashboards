import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-payment-method-dialog',
  templateUrl: './payment-method-dialog.component.html',
  styleUrls: ['./payment-method-dialog.component.css']
})
export class PaymentMethodDialogComponent implements OnInit {
  step = 1;

  constructor(private dialogRef: MatDialogRef<PaymentMethodDialogComponent>) { }

  ngOnInit(): void {
  }

  next() {
    this.step++;
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
