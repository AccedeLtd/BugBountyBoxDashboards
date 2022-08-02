import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
import LoadStatus from 'src/app/core/_utils/LoadStatus';
import { BankDto } from 'src/app/core/_utils/payout-account.dto';
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
  loadStatus: LoadStatus = 'loading';
  banks: any;
  readonly bank = new FormControl('', Validators.required);
  readonly accountNumber = new FormControl(null, Validators.required);

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
    this.loadStatus = 'loading';
    const supportedCountries = ['NG', 'GH', 'KE', 'UG', 'ZA', 'TZ'];
    this.hackerService.getProfile().subscribe((user) => {
      if (!user.country) {
        this.closeDialog();
        this.alertService
          .confirm(
            'Country Not Specified',
            undefined,
            'Ok',
            undefined,
            'You have to specify your country in <b>Settings > User Information</b> before you can link your bank account.'
          )
          .then((result) => {
            if(result.isConfirmed)
              this.router.navigateByUrl('hacker/settings');
          }
          );
      } else {
        const country = countries.find(
          (c) => c.name.toLowerCase() == user.country.toLowerCase()
        );

        if (country && supportedCountries.includes(country.code)) {
          this.hackerService.getBanks().subscribe({
            next: (result) => {
              this.loadStatus = 'success';
              this.banks = result;
            },
            error: () => {
              this.loadStatus = 'error';
            },
          });
        } else {
          this.closeDialog();
          this.alertService
          .confirm(
            'This feature is not available in your region.',
            'Bank account payments are only supported in Ghana, Kenya, Nigeria, Tanzania, Uganda and South Africa.',
            'Ok'
          )
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
        accountBank: this.selectedPaymentPlatform == PaymentMethodPlatform.Mpesa ? 'MPESA' : 'PAYPAL',
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

  submitFlutterwaveDetails() {
    this.submitting = true;
    const selectedBank = this.bank.value as BankDto;

    const params = {
      userId: this.userData.sub,
      email: this.userData.email,
      phone: this.userData.phone,
      accountBank: selectedBank.name,
      accountNumber: this.accountNumber.value,
      platform: this.selectedPaymentPlatform
    };

    this.hackerService.addPaymentMethod(params).subscribe({
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

  selectPaymentPlatform(): void {
    const controls = (this.paymentPlatformForm.controls) as any;
    const value = controls.paymentPlatform.value;

    if(value) {
      this.submitting = true;
      const paymentPlatform = parseInt(value);
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

      this.selectedPaymentPlatform = paymentPlatform;

      setTimeout(() => {
        this.submitting = false;
        this.step++;
      }, 1000);

      if(this.selectedPaymentPlatform == PaymentMethodPlatform.Flutterwave) this.loadBanks();
    }
    else {
      this._snackBar.open('Payment platform is required', 'Close');
    }
  }
  
}
