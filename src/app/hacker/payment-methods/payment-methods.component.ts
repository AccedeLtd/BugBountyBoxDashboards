import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogActions } from 'src/app/core/_enums/dialoagActions';
import { PaymentMethodPlatform } from 'src/app/core/_enums/paymentMethodPlatform';
import { AlertService } from 'src/app/core/_services/alert.service';
import { HackerService } from 'src/app/core/_services/hacker.service';
import { NotificationService } from 'src/app/core/_services/notification.service';
import Swal from 'sweetalert2';
import { PaymentMethodDialogComponent } from '../settings/payment-method-dialog/payment-method-dialog.component';

@Component({
  selector: 'app-payment-methods',
  templateUrl: './payment-methods.component.html',
  styleUrls: ['./payment-methods.component.css']
})
export class PaymentMethodsComponent implements OnInit {
  loadingPaymentMethods: boolean = true;
  PaymentMethodPlatform = PaymentMethodPlatform;
  paymentMethods: any[] = [];

  constructor(
    public dialog: MatDialog,
    public hackerService: HackerService,
    public notifyService: NotificationService,
    public alertService: AlertService,
  ) { }

  ngOnInit(): void {
    this.loadPaymentMethods();
  }

  loadPaymentMethods() {
    this.loadingPaymentMethods = true;

    this.hackerService.getPaymentMethods().subscribe({
      next: (result) => {
        this.paymentMethods = result.data;
        this.loadingPaymentMethods = false;
      },
      error: (error) => {
        this.loadingPaymentMethods = false;
        this.notifyService.showError("Something went wrong", "Error");
      },
    });
  }
  
  removePaymentMethod(id: any) {
    this.alertService.confirm().then((result) => {
      if (result.value) {
        this.hackerService.removePaymentMethod(id).subscribe({
          next: (result) => {
            this.notifyService.showSuccess("Removed successfully", "Success");
            this.loadPaymentMethods();
          },
          error: (error) => {
            this.notifyService.showError("Something went wrong", "Error");
          },
        });
      }
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(PaymentMethodDialogComponent, {
      height: '600px',
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(
      result => {
        if(result.event == DialogActions.Update) {
          this.loadPaymentMethods();
        }
      }
    )
  }

}
