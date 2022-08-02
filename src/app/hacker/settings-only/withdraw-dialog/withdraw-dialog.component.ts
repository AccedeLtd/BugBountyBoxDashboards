import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { ICreateOrderRequest, IPayPalConfig } from 'ngx-paypal';
import { DialogActions } from 'src/app/core/_enums/dialoagActions';
import { PaymentMethodPlatform } from 'src/app/core/_enums/paymentMethodPlatform';
import { HackerService } from 'src/app/core/_services/hacker.service';
import { NotificationService } from 'src/app/core/_services/notification.service';
import { WalletsService } from 'src/app/core/_services/wallets.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-withdraw-dialog',
  templateUrl: './withdraw-dialog.component.html',
  styleUrls: ['./withdraw-dialog.component.css']
})
export class WithdrawDialogComponent implements OnInit {
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
  isSuccess: boolean | undefined;
  PaymentMethodPlatform = PaymentMethodPlatform;
  selectedPaymentMethod: any;

  constructor(
    private dialogRef: MatDialogRef<WithdrawDialogComponent>,
    private _snackBar: MatSnackBar,
    private fb: FormBuilder,
    public walletsService: WalletsService,
    public oidcSecurityService: OidcSecurityService,
    public hackerService: HackerService,
    public notifyService: NotificationService,
  ) { }

  ngOnInit(): void {
    this.token = this.oidcSecurityService.getAccessToken();
    // this.userData = this.oidcSecurityService.getUserData();
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

  withdrawWithMpesa(): void {
    let body = {
      amount: parseInt(this.fund),
      platform: PaymentMethodPlatform.Mpesa,
    }

    this.submitting = true;

    // TODO: use RxJS
    this.hackerService.withdrawFromWallet(body).subscribe({
      next: (result) => {
        if (result.isSuccess) {
          this.notifyService.showInfo("Your withdrawal is being processed", "Info");
          this.isSuccess = true;
        } else {
          this.notifyService.showError("Your withdrawal was not successfully", "Error");
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
}
