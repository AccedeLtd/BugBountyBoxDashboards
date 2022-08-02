import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { ICreateOrderRequest, IPayPalConfig } from 'ngx-paypal';
import { DialogActions } from 'src/app/core/_enums/dialoagActions';
import { PaymentMethodPlatform } from 'src/app/core/_enums/paymentMethodPlatform';
import { HackerService } from 'src/app/core/_services/hacker.service';
import { NotificationService } from 'src/app/core/_services/notification.service';
import { WalletsService } from 'src/app/core/_services/wallets.service';
import { environment } from 'src/environments/environment';
import { PaymentMethodDialogComponent } from '../payment-method-dialog/payment-method-dialog.component';

@Component({
  selector: 'app-withdraw-dialog',
  templateUrl: './withdraw-dialog.component.html',
  styleUrls: ['./withdraw-dialog.component.css']
})
export class WithdrawDialogComponent implements OnInit {
  amountForm!: FormGroup;
  paymentPlatformForm!: FormGroup;
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
  selectedPaymentPlatform: any;
  selectedPaymentMethod: any;
  paymentMethods: any[] = [];
  flutterwaveSelected!: boolean;
  availablePaymentMethods: any;

  constructor(
    private dialogRef: MatDialogRef<WithdrawDialogComponent>,
    private _snackBar: MatSnackBar,
    private fb: FormBuilder,
    public walletsService: WalletsService,
    public oidcSecurityService: OidcSecurityService,
    public hackerService: HackerService,
    public notifyService: NotificationService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.token = this.oidcSecurityService.getAccessToken();
    this.initAmountForm();
    this.initPaymentPlatformForm();
    this.initPaymentMethodForm();
    this.loadPaymentMethods();
  }

  initAmountForm(): void {
    this.amountForm = this.fb.group({
      amount: [
        '',
        Validators.compose([
          Validators.required,
          Validators.maxLength(6)
        ])
      ]
    });
	}
  
  initPaymentPlatformForm(): void {
    this.paymentPlatformForm = this.fb.group({
      paymentPlatform: [
        '',
        Validators.required
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

  loadPaymentMethods() {
    this.hackerService.getPaymentMethods().subscribe({
      next: (result) => {
        this.paymentMethods = result.data;
      },
      error: (error) => {
      //  console.log('Payment method {error}', error);
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
        this.initPaymentPlatformForm();
      }, 1000);
    }
    else {
      this._snackBar.open('Amount is required', 'Close');
    }
  }

  selectPaymentPlatform(): void {
    const controls = (this.paymentPlatformForm.controls) as any;
    const value = controls.paymentPlatform.value;

    if(value) {
      const paymentPlatform = parseInt(value);
      this.submitting = true;
      switch (paymentPlatform) {
        case 0:
          this.mpesaSelected = true;
          this.paypalSelected = false;
          this.flutterwaveSelected = false;
          break;
        case 1:
          this.paypalSelected = true;
          this.mpesaSelected = false;
          this.flutterwaveSelected = false;
          break;
        case 3:
          this.flutterwaveSelected = true;
          this.paypalSelected = false;
          this.mpesaSelected = false;
          break;
      
        default:
          break;
      }

      this.getAvailablePaymentMethods(paymentPlatform);
      this.selectedPaymentPlatform = paymentPlatform;
      
      setTimeout(() => {
        this.submitting = false;
        this.step++;
      }, 1000);
    }
    else {
      this._snackBar.open('Payment platform is required', 'Close');
    }
  }
  
  getAvailablePaymentMethods(paymentPlatform: any) {
    this.availablePaymentMethods = this.paymentMethods.filter(a => a.platform == paymentPlatform);
  }

  selectPaymentMethod(): void {
    const controls = (this.paymentMethodForm.controls) as any;
    const value = controls.paymentMethod.value;

    if(value) {
      this.submitting = true;
      const paymentMethod = parseInt(value);
      
      this.selectedPaymentMethod = this.paymentMethods.find(a => a.id == paymentMethod);
      console.log(this.selectedPaymentMethod);
      
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
      paymentMethodId: this.selectedPaymentMethod.id
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

  withdrawWithFlutterwave(): void {
    let body = {
      amount: parseInt(this.fund),
      platform: PaymentMethodPlatform.Flutterwave,
      paymentMethodId: this.selectedPaymentMethod.id
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

  addPaymentMethod() {
    this.closeDialog();
    
    const dialogRef = this.dialog
    .open(PaymentMethodDialogComponent, {
      height: '600px',
      width: '400px',
    })
    .afterClosed()
    .subscribe(
      result => {
        if(result.event == DialogActions.Update) {
          this.loadPaymentMethods();
        }
      }
    )
  }
}
