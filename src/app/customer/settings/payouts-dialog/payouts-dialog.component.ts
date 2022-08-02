import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { ICreateOrderRequest, IPayPalConfig } from 'ngx-paypal';
import { catchError } from 'rxjs';
import { DialogActions } from 'src/app/core/_enums/dialoagActions';
import { PaymentMethodPlatform } from 'src/app/core/_enums/paymentMethodPlatform';
import { CustomerService } from 'src/app/core/_services/customer.service';
import { NotificationService } from 'src/app/core/_services/notification.service';
import { WalletsService } from 'src/app/core/_services/wallets.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-payouts-dialog',
  templateUrl: './payouts-dialog.component.html',
  styleUrls: ['./payouts-dialog.component.css']
})
export class PayoutsDialogComponent implements OnInit {
  amountForm!: FormGroup;
  paymentMethodForm!: FormGroup;
  step = 1;
  submitting: boolean | undefined;
  walletkey = '3Bwallet';
  fund!: string;
  showError!: boolean;
  showSuccess!: boolean;
  showCancel!: boolean;
  payPalConfig?: IPayPalConfig;
  paypalSelected: boolean | undefined;
  mpesaSelected: boolean | undefined;
  error: any;
  token: string | undefined;
  userData: any;
  rating: number = 0;
  isSuccess: boolean | undefined;

  constructor(
    private dialogRef: MatDialogRef<PayoutsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _snackBar: MatSnackBar,
    private fb: FormBuilder,
    public walletsService: WalletsService,
    public oidcSecurityService: OidcSecurityService,
    public customerService: CustomerService,
    public notifyService: NotificationService,
  ) { }

  ngOnInit(): void {
    // console.log(this.data);
    this.rating = 0;
    this.token = this.oidcSecurityService.getAccessToken();
    this.userData = this.oidcSecurityService.getUserData();
    this.initAmountForm();
    this.initPaymentMethodForm();
  }

  initAmountForm(): void {
    this.amountForm = this.fb.group({
      amount: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(5)
        ])
      ]
    });
	}
  
  initPaymentMethodForm(): void {
    this.paymentMethodForm = this.fb.group({
      paymentMethod: [
        '',
        Validators.required
      ]
    });
	}

  next(): void {
    this.submitting = true;
    setTimeout(() => {
      this.submitting = false;
      this.step++;
    }, 2000);
  }

  updateAction(): void {
    this.dialogRef.close({event: DialogActions.Update});
  }
  
  closeDialog(): void {
    this.dialogRef.close({event: DialogActions.Cancel});
  }

  pay(): void {
    this.submitting = true;
    const body = {
      bugReportId: this.data.id,
      hackerRating: this.rating,
    }

    this.customerService.makePayment(body).subscribe({
      next: (result) => {
        if (result.success) {
          this.notifyService.showSuccess("Payment was successful", "Success");
          this.isSuccess = true;
        } else {
          this.notifyService.showError("Payment was not successful", "Error");
          this.isSuccess = false;
        }

        this.submitting = false;
        this.step++;
      },
      error: (err) => {
        const error = err.error?.error?.details?.split('\r\n') || null;
        this.error = error[0];
        this.notifyService.showError(error[0], "Error");
        this.isSuccess = false;
        this.submitting = false;
        this.step++;
      }
    })
  }

  submitAmount(): void {
    const controls = (this.amountForm.controls) as any;
    const fund = controls.amount.value;

    if(fund) {
      this.submitting = true;
      
      setTimeout(() => {
        this.submitting = false;
        this.step++;
        this.initPaymentMethodForm();
      }, 1000);
    }
    else {
      this._snackBar.open('Amount is required', 'Close');
    }
  }

  selectPaymentMethod(): void {
    const controls = (this.paymentMethodForm.controls) as any;
    const paymentMethod = controls.paymentMethod.value;
    this.initConfig(this.fund);

    if(paymentMethod) {
      this.submitting = true;
      switch (paymentMethod) {
        case '0':
          this.paypalSelected = false;
          this.mpesaSelected = true;
          break;
        case '1':
          this.paypalSelected = true;
          this.mpesaSelected = false;
          break;
        case '2':
          this.paypalSelected = false;
          this.mpesaSelected = false;
          break;
        case '3':
          this.paypalSelected = false;
          this.mpesaSelected = false;
          break;
      
        default:
          break;
      }
      
      setTimeout(() => {
        this.submitting = false;
        this.step++;
      }, 1000);
    }
    else {
      this._snackBar.open('Payment method is required', 'Close');
    }
  }

  fundWithMpesa(): void {
    let body = {
      amount: parseInt(this.fund),
      receiverUserId: this.userData.sub,
      description: "Topup",
      platform: PaymentMethodPlatform.Mpesa,
    }

    this.submitting = true;

    // TODO: use RxJS
    this.walletsService.topupWallet(body).subscribe(
      result => {
        this.submitting = false;
        this.step++;
      }
    )
  }

  private initConfig(price: string): void {
    
    this.payPalConfig = {
      clientId: 'sb',
      // Order is created on the server and the order id is returned
      createOrderOnServer: (data) => fetch(
          `${environment.customerPortalApiUrl}/v1/Wallets/Transactions/Orders`,
          {
            method: "post",
            body: JSON.stringify({ amount: parseInt(price) }),
            headers: {
              'Authorization': 'Bearer ' + this.token,
              'Content-Type': 'application/json'
            }
          }
        )
        .then(
          (result) => {
        //    console.log(result);
            return result.json();
          }
        )
        .then(
          (order) => {
        //    console.log(order);
            return order.result.orderDto.id;
          }
        ),
      // Finalize the transaction on the server after payer approval
      onApprove: (data, actions) => fetch(
          `${environment.customerPortalApiUrl}/v1/Wallets/Transactions/Orders/Capture`,
          {
            method: "post",
            body: JSON.stringify({ id: data.orderID }),
            headers: {
              'Authorization': 'Bearer ' + this.token,
              'Content-Type': 'application/json'
            }
          }
        )
        .then(
          (result) => {
        //    console.log(result);
            return result.json();
          }
        )
        .then((orderData) => {
          // Successful capture! For dev/demo purposes:
      //    console.log('Capture result', orderData, JSON.stringify(orderData, null, 2));
          if (orderData.status == 1) {
            this.step++;
          }
          else {
            this.step++;
            this.error = true;
          }
          
          // const transaction = orderData.purchase_units[0].payments.captures[0];
          // alert(`Transaction ${transaction.status}: ${transaction.id}\n\nSee console for all available details`);
          // When ready to go live, remove the alert and show a success message within this page. For example:
          // const element = document.getElementById('paypal-button-container');
          // element.innerHTML = '<h3>Thank you for your payment!</h3>';
          // Or go to another URL:  actions.redirect('thank_you.html');
        }),
      onCancel: (data, actions) => {
    //    console.log('OnCancel', data, actions);
        this.showCancel = true;
      },
      onError: err => {
    //    console.log('OnError', err);
        this.showError = true;
      },
      onClick: (data, actions) => {
    //    console.log('onClick', data, actions);
        this.resetStatus();
      },
    };
  }

  private resetStatus(): void {
    this.showError = false;
    this.showSuccess = false;
    this.showCancel = false;
  }

}
