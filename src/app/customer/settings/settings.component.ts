import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { Component, Inject, OnInit } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { HackerService } from 'src/app/core/_services/hacker.service';
import {MatDialog} from '@angular/material/dialog';
import { PaymentMethodDialogComponent } from './payment-method-dialog/payment-method-dialog.component';
import { DialogActions } from 'src/app/core/_enums/dialoagActions';
import { PaymentMethodPlatform } from 'src/app/core/_enums/paymentMethodPlatform';
import { NotificationService } from 'src/app/core/_services/notification.service';
import { AlertService } from 'src/app/core/_services/alert.service';
import { CustomerService } from 'src/app/core/_services/customer.service';
import { ProfileState } from 'src/app/core/_enums/profileState';
import { ProfileService } from 'src/app/core/_services/profile.service';
import { constants } from 'src/app/core/_utils/const';
import { ThemePalette } from '@angular/material/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  searchInput!: string;
  sideNavOpened = false;
  user: any;
  authUser: any;
  userName: any;
  loading: boolean = true;
  loadingBounties: boolean = true;
  bounties: any;
  showUserInfo = true;
  PaymentMethodPlatform = PaymentMethodPlatform;
  showPaymentMethod!: boolean;
  loadingPaymentMethods: boolean = true;
  paymentMethods: any[] = [];
  loadingOrganization: boolean = true;
  updateLoading: boolean = false;
  isChangePassword: boolean = false;
  isChangeEmail: boolean = false;
  file!: File;
  uploading: boolean = false;
  showNotification: boolean = false;
  showHelp: boolean = false;
  showDeleteAccount: boolean = false;
  color: ThemePalette = 'primary';

  constructor(
    public oidcSecurityService: OidcSecurityService,
    public customerService: CustomerService,
    public notifyService: NotificationService,
    public alertService: AlertService,
    public profileService: ProfileService,
    public dialog: MatDialog,
  ) {

  }

  async ngOnInit(): Promise<void> {
    this.loadOrganization();
		this.loadPaymentMethods();
	}

  loadOrganization() {
    this.loadingOrganization = true;
    this.customerService.getCustomer().subscribe({
      next:result => {
        this.user = result;
        this.loadingOrganization = false;
      },
      error:() => {
        this.loadingOrganization = false;
        this.notifyService.showError("Something went wrong, please try again", "Error");
      }
    })
  }

  updateOrganization() {
    this.updateLoading = true;
    this.customerService.updateOrganization(this.user).subscribe({
      next:() => {
        this.updateLoading = false;  
        this.notifyService.showSuccess("Profile updated successfully", "Success")
      },
      error:() => {
        this.updateLoading = false;
        this.notifyService.showError("Profile updated not successful", "Error")
      },
    })
  }

  changePassword(value: any) {
    this.updateLoading = true;
//    console.log(value);

    this.customerService.changePassword(value).subscribe({
      next:result => {
        //    console.log(result)
        this.updateLoading = false;
        this.isChangePassword = false;
        this.notifyService.showSuccess("Password changed successfully", "Congratulations")
      },
      error:() => {
        this.updateLoading = false;
        this.notifyService.showError("Something went wrong changing password, please try agian", "Error")
      }
    })
  }

  toggleChangePassword() {
    this.isChangePassword = !this.isChangePassword;
  }
  
  toggleChangeEmail() {
    this.isChangeEmail = !this.isChangeEmail;
  }

  onChange(event:any) {
    this.file = event.target.files[0];
    this.onUpload();
  }

  onUpload() {
    this.uploading = true;
//    console.log(this.file);
    this.customerService.uploadAvatar(this.file).subscribe({
       next: result => {
         if(this.file.type.includes("image/")){
          // this.user.logoUrl = result.result.logoUrl;
          this.user.logoUrl = result.result.url;
      //    console.log(this.user.logoUrl);
          //Update avatar in nav
          this.profileService.updateSubject.next(ProfileState.Update)
          this.uploading = false;
         }
        },
        error:() => {
          this.notifyService.showError("Image update was not successful", "Error");
          this.uploading = false;
        },
        complete:() => {
          this.notifyService.showSuccess("Image updated successfully", "Success");
          this.uploading = false;
        }
      });
  }

  loadPaymentMethods() {
    this.loadingPaymentMethods = true;

    this.customerService.getPaymentMethods().subscribe({
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
        this.customerService.removePaymentMethod(id).subscribe({
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

  toggleSideNav() {
    this.sideNavOpened = !this.sideNavOpened;
  }

  logout() {
    this.oidcSecurityService.logoff();
  }

  toggle(step: any) {
    switch (step.index) {
      case 0:
        this.showUserInfo = true;
        this.showPaymentMethod = false;
        this.showNotification = false;
        this.showHelp = false;
        this.showDeleteAccount = false;
        break;
      case 1:
        this.showPaymentMethod = true;
        this.showUserInfo = false;
        this.showNotification = false;
        this.showHelp = false;
        this.showDeleteAccount = false;
        break;
      case 2:
        this.showNotification = true;
        this.showUserInfo = false;
        this.showPaymentMethod = false;
        this.showHelp = false;
        this.showDeleteAccount = false;
        break;
      case 3:
        this.showHelp = true;
        this.showNotification = false;
        this.showUserInfo = false;
        this.showPaymentMethod = false;
        this.showDeleteAccount = false;
        break;
      case 4:
        this.showDeleteAccount = true;
        this.showHelp = false;
        this.showNotification = false;
        this.showUserInfo = false;
        this.showPaymentMethod = false;
        break;
    
      default:
        break;
    }
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

  confirmAccountDelete() {
    this.alertService.confirmInput(
      'This is extremely important.',
      'We will immediately delete all of your projects, along with all of your comments on projects. You will no longer be billed, and after 90 days your username will be available to anyone on BugBountyBox.',
      'To verify, type DELETE',
      'Delete this account',
    ).then((result) => {
      if (!result) {
        this.alertService.error('Cancelled', 'Account deletion aborted.');
      }
      else if (result) {
        this.customerService.deleteAccount(result).subscribe({
          next:() => this.oidcSecurityService.logoff(constants.HACKER),
          error:() => this.alertService.error('Something went wrong', 'Account deletion aborted.')
        });
      }
    })
  }

}