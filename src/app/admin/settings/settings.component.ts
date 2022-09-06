import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { Component, Inject, NgZone, OnInit } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { HackerService } from 'src/app/core/_services/hacker.service';
import {MatDialog} from '@angular/material/dialog';
import { PaymentMethodDialogComponent } from './payment-method-dialog/payment-method-dialog.component';
import { AdminService } from 'src/app/core/_services/admin.services';
import { NotificationService } from 'src/app/core/_services/notification.service';
import {AuthenticatedAdminJson} from 'src/app/core/_models/authAdminJson'; 
import { AdminNavComponent } from 'src/app/admin/admin-nav/admin-nav.component';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { ProfileState } from 'src/app/core/_enums/profileState';
import { ProfileService } from 'src/app/core/_services/profile.service';
import { ThemePalette } from '@angular/material/core';
import countries from 'src/app/core/_utils/countries';

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
  loadingAdmin: boolean = true;
  bounties: any;
  showUserInfo = true;
  isChangePassword: boolean = false;
  isChangeEmail: boolean = false;
  file!: File; 
  shortLink: string = "";
  updateLoading: boolean = false;
  authenticatedAdmin:AuthenticatedAdminJson = {
    id:0,
    firstName:'',
    lastName:'',
    countryOfResidence:null,
    email:'',
    phoneNumber:null,
    userName:'',
    userId:'',
    profilePhotoUrl:null,
    fullName:'',
    role:''
  }
  showNotification: boolean = false;
  uploading: boolean = false;
  color: ThemePalette = 'primary';
  readonly countries = countries;

  constructor(
    public oidcSecurityService: OidcSecurityService,
    public hackerService: HackerService,
    public adminService: AdminService,
    public notify:NotificationService,
    public dialog: MatDialog,
    public profileService: ProfileService,
    @Inject(DOCUMENT) public document: Document,
  ) {

  }

  async ngOnInit(): Promise<void> {
    this.getAuthAdmin();   
	}

  getAuthAdmin(){
    this.loadingAdmin = true;
    this.adminService.getAuthAdmin().subscribe({
      next:results => {
        this.loadingAdmin = false;
        this.user = results;
      },
      error:() => {
        this.loadingAdmin = false;
        this.notify.showError("Profile update not successful", "Error");
      }
    })
  }

  update(){
    this.updateLoading = true;
    this.adminService.updateAuthAdmin(this.authenticatedAdmin).subscribe({
      next:() => {
        this.updateLoading = false;  
        this.notify.showSuccess("Profile updated successfully", "Success")
      },
      error:() => {
        this.updateLoading = false;
        this.notify.showError("Profile update not successful", "Error")
      }
    })
  }

  changePassword(value: any) {
    this.updateLoading = false;
    this.adminService.changePassword(value).subscribe({
      next:() => {
        this.updateLoading = false;
        this.notify.showSuccess("Password changed successfully", "Success")
      },
      error:() => {
        this.updateLoading = false;
        this.notify.showError("Something went wrong changing password, please try again", "Error")
      }
    })
  }

  onChange(event:any) {
    this.file = event.target.files[0];
    this.onUpload();
  }

  onUpload() {
    this.uploading = true;
    //    console.log(this.file);
    this.adminService.uploadAvatar(this.file).subscribe({
      next: results => {
        if (this.file.type.includes("image/")) {
          this.authenticatedAdmin.profilePhotoUrl = results.result.profilePhotoUrl;
          //    console.log(this.authenticatedAdmin.profilePhotoUrl);
          //Update avatar in nav
          this.profileService.updateSubject.next(ProfileState.Update);
          this.uploading = false;
        }
      },
      error:() => {
        this.notify.showError("Image update was not successful", "Error");
        this.uploading = false;
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
        this.showNotification = false;
        break;
      case 1:
        this.showNotification = true;
        this.showUserInfo = false;
        break;
    
      default:
        break;
    }
  }

  openDialog() {
    this.dialog.open(PaymentMethodDialogComponent, {
      height: '500px',
      width: '400px',
    });
  }

  toggleChangePassword() {
    this.isChangePassword = !this.isChangePassword;
  }
  
  toggleChangeEmail() {
    this.isChangeEmail = !this.isChangeEmail;
  }

}