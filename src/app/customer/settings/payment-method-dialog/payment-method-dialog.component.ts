import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { IPayPalConfig } from 'ngx-paypal';
import { DialogActions } from 'src/app/core/_enums/dialoagActions';
import { PaymentMethodPlatform } from 'src/app/core/_enums/paymentMethodPlatform';
import { CustomerService } from 'src/app/core/_services/customer.service';
import { NotificationService } from 'src/app/core/_services/notification.service';
import { WalletsService } from 'src/app/core/_services/wallets.service';
import { constants } from 'src/app/core/_utils/const';

@Component({
  selector: 'app-payment-method-dialog',
  templateUrl: './payment-method-dialog.component.html',
  styleUrls: ['./payment-method-dialog.component.css']
})
export class PaymentMethodDialogComponent implements OnInit {
  amountForm!: FormGroup;
  paymentMethodForm!: FormGroup;
  paymentMethodDetailsForm!: FormGroup;
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
  isSuccess: boolean | undefined;
  PaymentMethodPlatform = PaymentMethodPlatform;
  selectedPaymentMethod: any;

  constructor(
    private dialogRef: MatDialogRef<PaymentMethodDialogComponent>,
    private _snackBar: MatSnackBar,
    private fb: FormBuilder,
    public walletsService: WalletsService,
    public oidcSecurityService: OidcSecurityService,
    public customerService: CustomerService,
    public notifyService: NotificationService,
  ) { }

  ngOnInit(): void {
    this.userData = this.oidcSecurityService.getUserData(constants.CUSTOMER);
    this.initPaymentMethodForm();
    this.initPaymentDetailsMethodForm();
  }
  
  initPaymentMethodForm(): void {
    this.paymentMethodForm = this.fb.group({
      paymentMethod: [
        '',
        Validators.required
      ]
    });
	}
  
  initPaymentDetailsMethodForm(): void {
    this.paymentMethodDetailsForm = this.fb.group({
      paymentMethodDetails: [
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

  submitPaymentMethodDetails(): void {
    const controls = (this.paymentMethodDetailsForm.controls) as any;
    const paymentMethodDetails = controls.paymentMethodDetails.value;

    if(paymentMethodDetails) {
      this.submitting = true;

      let input = {
        userId: this.userData.sub,
        email: this.selectedPaymentMethod == PaymentMethodPlatform.Mpesa ? this.userData.email : paymentMethodDetails,
        phone: this.selectedPaymentMethod == PaymentMethodPlatform.Mpesa ? `254${paymentMethodDetails}` : this.userData.phone,
        accountNumber: this.selectedPaymentMethod == PaymentMethodPlatform.Mpesa ? `254${paymentMethodDetails}` : undefined,
        platform: parseInt(this.selectedPaymentMethod)
      }

  //    console.log(input);

      this.customerService.addPaymentMethod(input).subscribe({
        next: (result) => {
          this.notifyService.showSuccess("Payment method added successfully", "Success");
          this.isSuccess = true;
          this.submitting = false;
          this.step++;
        },
        error: (result) => {
          this.notifyService.showError("Something went wrong", "Error");
          this.isSuccess = false;
          this.submitting = false;
          this.step++;
        },
      });
    }
    else {
      this._snackBar.open('Amount is required', 'Close');
    }
  }

  selectPaymentMethod(): void {
    const controls = (this.paymentMethodForm.controls) as any;
    const paymentMethod = controls.paymentMethod.value;

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

      this.selectedPaymentMethod = paymentMethod;
      
      setTimeout(() => {
        this.submitting = false;
        this.step++;
      }, 1000);
    }
    else {
      this._snackBar.open('Payment method is required', 'Close');
    }
  }

}
