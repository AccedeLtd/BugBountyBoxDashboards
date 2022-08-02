import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { ICreateOrderRequest, IPayPalConfig } from 'ngx-paypal';
import { DialogActions } from 'src/app/core/_enums/dialoagActions';
import { PaymentMethodPlatform } from 'src/app/core/_enums/paymentMethodPlatform';
import { CustomerService } from 'src/app/core/_services/customer.service';
import { WalletsService } from 'src/app/core/_services/wallets.service';
import { constants } from 'src/app/core/_utils/const';
import { environment } from 'src/environments/environment';
import { PaymentMethodDialogComponent } from '../payment-method-dialog/payment-method-dialog.component';

@Component({
  selector: 'app-add-funds-dialog',
  templateUrl: './add-funds-dialog.component.html',
  styleUrls: ['./add-funds-dialog.component.css']
})
export class AddFundsDialogComponent implements OnInit {
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
  error: boolean | undefined;
  token: string | undefined;
  userData: any;
  paymentMethods: any[] = [];
  userMpesaDetails: any;

  constructor(
    private dialogRef: MatDialogRef<AddFundsDialogComponent>,
    private _snackBar: MatSnackBar,
    private fb: FormBuilder,
    public walletsService: WalletsService,
    public oidcSecurityService: OidcSecurityService,
    public customerService: CustomerService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.token = this.oidcSecurityService.getAccessToken(constants.CUSTOMER);
    this.userData = this.oidcSecurityService.getUserData(constants.CUSTOMER);
    this.initAmountForm();
    this.initPaymentMethodForm();
    this.loadCustomer();
    this.loadPaymentMethods();
  }

  initAmountForm(): void {
    this.amountForm = this.fb.group({
      amount: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(6)
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

  loadCustomer() {
    this.customerService.getCustomer().subscribe({
      next: result => this.userData = result
    })
  }

  loadPaymentMethods() {
    this.customerService.getPaymentMethods().subscribe({
      next: (result) => {
        this.paymentMethods = result.data;
      },
      error: (error) => {
    //    console.log('Payment method {error}', error);
      },
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

  submitAmount(): void {
    const controls = (this.amountForm.controls) as any;
    const fund = controls.amount.value;

    if(fund) {
      this.submitting = true;
      this.fund = fund;
      
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
          this.checkForMpesa();
          break;
        case '1':
          this.paypalSelected = true;
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

  checkForMpesa() {
    const result = this.paymentMethods.filter((p) => p.platform == PaymentMethodPlatform.Mpesa);
    if (result) {
      this.userMpesaDetails = result[0];
    }
  }

  addPaymentMethod() {
    this.closeDialog();
    
    const dialogRef = this.dialog.open(PaymentMethodDialogComponent, {
      height: '500px',
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

  fundWithMpesa(): void {
    let body = {
      amount: parseInt(this.fund),
      phoneNumber: this.userMpesaDetails.phone,
      description: "Topup",
      platform: PaymentMethodPlatform.Mpesa,
    }

    this.submitting = true;

    // TODO: use RxJS
    this.customerService.topupWallet(body).subscribe(
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
