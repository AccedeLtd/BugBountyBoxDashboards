import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { DialogActions } from 'src/app/core/_enums/dialoagActions';
import { PaymentMethodPlatform } from 'src/app/core/_enums/paymentMethodPlatform';
import { AlertService } from 'src/app/core/_services/alert.service';
import { HackerService } from 'src/app/core/_services/hacker.service';
import { NotificationService } from 'src/app/core/_services/notification.service';
import countries from 'src/app/core/_utils/countries';
import LoadStatus from 'src/app/core/_utils/LoadStatus';
import { BankDto } from 'src/app/core/_utils/payout-account.dto';

@Component({
  selector: 'app-edit-payment-method-dialog',
  templateUrl: './edit-payment-method-dialog.component.html',
  styleUrls: ['./edit-payment-method-dialog.component.css']
})
export class EditPaymentMethodDialogComponent implements OnInit {
  loadStatus: LoadStatus = 'loading';
  submitting: boolean | undefined;
  paypalSelected: boolean | undefined;
  mpesaSelected: boolean | undefined;
  flutterwaveSelected: boolean | undefined;
  selectedPaymentPlatform: any;
  step: number = 0;
  banks: any;
  paymentPlatformDetailsForm!: FormGroup;
  userData: any;
  readonly bank = new FormControl('', Validators.required);
  readonly accountNumber = new FormControl(null, Validators.required);
  isSuccess: boolean | undefined;
  error: boolean | undefined;
  PaymentMethodPlatform = PaymentMethodPlatform;

  constructor(
    private dialogRef: MatDialogRef<EditPaymentMethodDialogComponent>,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public hackerService: HackerService,
    public alertService: AlertService,
    public router: Router,
    private fb: FormBuilder,
    public oidcSecurityService: OidcSecurityService,
    public notifyService: NotificationService,
  ) { }

  ngOnInit(): void {
    this.userData = this.oidcSecurityService.getUserData();
    this.initForm();
    this.initPaymentPlatformFormDetailsForm();
  }

  initForm(): void {
    const paymentPlatform = this.data.platform;
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

    this.step++;

    if (this.selectedPaymentPlatform == PaymentMethodPlatform.Flutterwave) this.loadBanks();
  }

  initPaymentPlatformFormDetailsForm(): void {
    this.paymentPlatformDetailsForm = this.fb.group({
      paymentPlatformDetails: [
        this.data.platform == PaymentMethodPlatform.Paypal ? this.data.email : this.data.accountNumber,
        Validators.required
      ]
    });
	}

  closeDialog(): void {
    this.dialogRef.close({event: DialogActions.Cancel});
  }

  updateAction(): void {
    this.dialogRef.close({event: DialogActions.Update});
  }

  next(): void {
    this.submitting = true;
    setTimeout(() => {
      this.submitting = false;
      this.step++;
    }, 2000);
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
              this.banks = result;
              const bank = this.banks.find(
                (b: any) => b.name == this.data!.accountBank
              );

              this.bank.setValue(bank, { emitEvent: false });
              this.accountNumber.setValue(this.data!.accountNumber, { emitEvent: false });
              this.loadStatus = 'success';
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

  submitPaymentMethodDetails(): void {
    const controls = (this.paymentPlatformDetailsForm.controls) as any;
    const paymentPlatformDetails = controls.paymentPlatformDetails.value;

    if(paymentPlatformDetails) {
      this.submitting = true;

      let input = {
        id: this.data.id,
        userId: this.userData.sub,
        email: this.selectedPaymentPlatform == PaymentMethodPlatform.Mpesa ? this.userData.email : paymentPlatformDetails,
        phone: this.selectedPaymentPlatform == PaymentMethodPlatform.Mpesa ? `254${paymentPlatformDetails}` : this.userData.phone,
        accountBank: this.selectedPaymentPlatform == PaymentMethodPlatform.Mpesa ? 'MPESA' : 'PAYPAL',
        accountNumber: this.selectedPaymentPlatform == PaymentMethodPlatform.Mpesa ? `254${paymentPlatformDetails}` : undefined,
        platform: this.selectedPaymentPlatform
      }

  //    console.log(input);

      this.hackerService.editPaymentMethod(input).subscribe({
        next: (result) => {
          this.notifyService.showSuccess("Payment method updated", "Success");
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
      id: this.data.id,
      userId: this.userData.sub,
      email: this.userData.email,
      phone: this.userData.phone,
      accountBank: selectedBank.name,
      accountNumber: this.accountNumber.value,
      platform: this.selectedPaymentPlatform
    };

    this.hackerService.editPaymentMethod(params).subscribe({
      next: (result) => {
        this.notifyService.showSuccess("Payment method update", "Success");
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

}
