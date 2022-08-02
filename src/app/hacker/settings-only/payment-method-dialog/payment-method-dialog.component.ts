import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { ICreateOrderRequest, IPayPalConfig } from 'ngx-paypal';
import { DialogActions } from 'src/app/core/_enums/dialoagActions';
import { PaymentMethodPlatform } from 'src/app/core/_enums/paymentMethodPlatform';
import { AlertService } from 'src/app/core/_services/alert.service';
import { HackerService } from 'src/app/core/_services/hacker.service';
import { NotificationService } from 'src/app/core/_services/notification.service';
import { WalletsService } from 'src/app/core/_services/wallets.service';
import countries from 'src/app/core/_utils/countries';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-payment-method-dialog',
  templateUrl: './payment-method-dialog.component.html',
  styleUrls: ['./payment-method-dialog.component.css']
})
export class PaymentMethodDialogComponent implements OnInit {
  amountForm!: FormGroup;
  paymentPlatformForm!: FormGroup;
  paymentPlatformDetailsForm!: FormGroup;
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
  selectedPaymentPlatform: any;
  PaymentMethodPlatform = PaymentMethodPlatform;
  flutterwaveSelected: boolean | undefined;
  banks: any;

  constructor(
    private dialogRef: MatDialogRef<PaymentMethodDialogComponent>,
    private _snackBar: MatSnackBar,
    private fb: FormBuilder,
    public walletsService: WalletsService,
    public oidcSecurityService: OidcSecurityService,
    public hackerService: HackerService,
    public notifyService: NotificationService,
    public alertService: AlertService,
    public router: Router,
  ) { }

  ngOnInit(): void {
    this.token = this.oidcSecurityService.getAccessToken();
    this.userData = this.oidcSecurityService.getUserData();
    this.initPaymentPlatformForm();
    this.initPaymentPlatformFormDetailsForm();
  }
  
  initPaymentPlatformForm(): void {
    this.paymentPlatformForm = this.fb.group({
      paymentPlatform: [
        '',
        Validators.required
      ]
    });
	}
  
  initPaymentPlatformFormDetailsForm(): void {
    this.paymentPlatformDetailsForm = this.fb.group({
      paymentPlatformFormDetails: [
        '',
        Validators.required
      ]
    });
	}

  loadBanks() {
    const supportedCountries = ['NG', 'GH', 'KE', 'UG', 'ZA', 'TZ'];
    this.hackerService.getProfile().subscribe((user) => {
      if (!user.country) {
        this.alertService
          .confirm(
            'Country Not Specified',
            'You have to specify your country in the settings before you can link your bank account.',
          )
          .then((result) => {
            if(result)
              this.router.navigateByUrl('hacker/settings');
          }
          );
      } else {
        const country = countries.find(
          (c) => c.name.toLowerCase() == user.country.toLowerCase()
        );

        if (country && supportedCountries.includes(country.code)) {
          this.hackerService.getBanks().subscribe((result) => {
            this.banks = result;
            this.submitting = false;
            this.step++;
          });
        } else {
          this.alertService
          .confirm(
            'This feature is not available in your region.',
            'Bank account payments are only supported in Ghana, Kenya, Nigeria, Tanzania, Uganda and South Africa.',
          )
          .then((result) => {
            if(result)
              this.router.navigateByUrl('hacker');
          }
          );
        }
      }
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
    const controls = (this.paymentPlatformDetailsForm.controls) as any;
    const paymentPlatformDetails = controls.paymentPlatformDetails.value;

    if(paymentPlatformDetails) {
      this.submitting = true;

      let input = {
        userId: this.userData.sub,
        email: this.selectedPaymentPlatform == PaymentMethodPlatform.Mpesa ? this.userData.email : paymentPlatformDetails,
        phone: this.selectedPaymentPlatform == PaymentMethodPlatform.Mpesa ? `254${paymentPlatformDetails}` : this.userData.phone,
        accountBank: this.selectedPaymentPlatform == PaymentMethodPlatform.Flutterwave ? paymentPlatformDetails : undefined,
        accountNumber: this.selectedPaymentPlatform == PaymentMethodPlatform.Mpesa ? `254${paymentPlatformDetails}` : undefined,
        platform: this.selectedPaymentPlatform
      }

  //    console.log(input);

      this.hackerService.addPaymentMethod(input).subscribe({
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

  selectPaymentPlatform(): void {
    const controls = (this.paymentPlatformForm.controls) as any;
    const paymentPlatform = controls.paymentPlatform.value;

    if(paymentPlatform) {
      this.submitting = true;
      switch (paymentPlatform) {
        case '0':
          this.mpesaSelected = true;
          this.paypalSelected = false;
          this.flutterwaveSelected = false;
          break;
        case '1':
          this.paypalSelected = true;
          this.mpesaSelected = false;
          this.flutterwaveSelected = false;
          break;
        case '2':
          this.flutterwaveSelected = true;
          this.paypalSelected = false;
          this.mpesaSelected = false;
          break;
      
        default:
          break;
      }

      this.selectedPaymentPlatform = parseInt(paymentPlatform);

      if(this.selectedPaymentPlatform == PaymentMethodPlatform.Flutterwave) {
        this.loadBanks();
      }
      else {
        setTimeout(() => {
          this.submitting = false;
          this.step++;
        }, 1000);
      }      
    }
    else {
      this._snackBar.open('Payment platform is required', 'Close');
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
