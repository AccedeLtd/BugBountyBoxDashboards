import { Component, OnInit } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { HackerService } from 'src/app/core/_services/hacker.service';
import {MatDialog} from '@angular/material/dialog';
import { PaymentMethodDialogComponent } from './payment-method-dialog/payment-method-dialog.component';
import { NotificationService } from 'src/app/core/_services/notification.service';
import { DialogActions } from 'src/app/core/_enums/dialoagActions';
import { AlertService } from 'src/app/core/_services/alert.service';
import { PaymentMethodPlatform } from 'src/app/core/_enums/paymentMethodPlatform';
import { ProfileService } from 'src/app/core/_services/profile.service';
import { ProfileState } from 'src/app/core/_enums/profileState';
import { environment } from 'src/environments/environment';
import { EncodeService } from 'src/app/core/_services/encode.service';
import { Router } from '@angular/router';
import { constants } from 'src/app/core/_utils/const';
import { ThemePalette } from '@angular/material/core';
import countries from 'src/app/core/_utils/countries';
import { EditPaymentMethodDialogComponent } from './edit-payment-method-dialog/edit-payment-method-dialog.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  sideNavOpened = false;
  userName: any;
  loadingHacker: boolean = true;
  showUserInfo = true;
  PaymentMethodPlatform = PaymentMethodPlatform;

  sections = [
    { id: '', title: 'Dashboard', active: false },
    { id: '/projects', child: '/projects/details', title: 'Projects', active: false },
    { id: '/bounty-activity', child: '/bounty-activity/details', title: 'Bounty Activity', active: false },
    { id: '/payments', child: '/payments/details', title: 'Payments', active: false },
  ];
  showPaymentMethod!: boolean;
  loadingPaymentMethods: boolean = true;
  paymentMethods: any[] = [];
  file!: File; 
  shortLink: string = "";
  uploading: boolean = false;
  updateLoading: boolean = false;
  user: any;
  isChangePassword: boolean = false;
  isChangeEmail: boolean = false;
  isChangeProficiencies: boolean = false;
  proficiencyLevelMap: { [k: string]: string} = {
    "1": "Intermediate",
    "2": "Intermediate",
    "3": "Proficient",
    "4": "Advanced",
    "5": "Advanced",
  }
  severity: number | undefined;
  proficiencyRatings: any[] = [];
  loadingProficiencies: boolean = true;
  proficiencies: any;
  showProficiencies: boolean = false;
  showNotification: boolean = false;
  showHelp: boolean = false;
  showDeleteAccount: boolean = false;
  color: ThemePalette = 'primary';
  readonly countries = countries;

  constructor(
    public oidcSecurityService: OidcSecurityService,
    public hackerService: HackerService,
    public notifyService: NotificationService,
    public alertService: AlertService,
    public profileService: ProfileService,
    public encodeService: EncodeService,
    public router: Router,
    public dialog: MatDialog,
  ) {

  }

  async ngOnInit(): Promise<void> {
    this.loadHacker();
		this.loadPaymentMethods();
    this.loadProficiencies();
	}
  
  loadHacker() {
    this.loadingHacker = true;
    this.hackerService.getHacker().subscribe({
      next:result => {
        this.user = result;
        this.loadingHacker = false;
      },
      error:() => {
        this.loadingHacker = false;
        this.notifyService.showError("Something went wrong, please try again", "Error")
      },
    })
  }

  updateHacker() {
    this.updateLoading = true;
    this.hackerService.updateHacker(this.user).subscribe({
      next:() => {
        this.updateLoading = false;  
        this.notifyService.showSuccess("Profile updated successfully", "Success")
      },
      error:() => {
        this.updateLoading = false;
        this.notifyService.showError("Profile update not successful", "Error")
      }
    })
  }

  changePassword(value: any) {
    this.updateLoading = false;
    this.hackerService.changePassword(value).subscribe({
      next:() => {
        this.updateLoading = false;
        this.notifyService.showSuccess("Password changed successfully", "Success")
      },
      error:() => {
        this.updateLoading = false;
        this.notifyService.showError("Something went wrong changing password, please try again", "Error")
      }
    })
  }

  toggleChangePassword() {
    this.isChangePassword = !this.isChangePassword;
  }
  
  toggleChangeEmail() {
    this.isChangeEmail = !this.isChangeEmail;
  }
  
  toggleChangeProficiencies() {
    this.isChangeProficiencies = !this.isChangeProficiencies;
    this.proficiencyRatings = [];
  }

  onChange(event:any) {
    this.file = event.target.files[0];
    this.onUpload();
  }

  onUpload() {
    this.uploading = true;
//    console.log(this.file);
    this.hackerService.uploadAvatar(this.file).subscribe({
       next: results => {
         if(this.file.type.includes("image/")){
          this.user.image = results.result.image;
      //    console.log(this.user.profilePhotoUrl);
          //Update avatar in nav
          this.profileService.updateSubject.next(ProfileState.Update);
          this.notifyService.showSuccess("Image updated successfully", "Success");
          this.uploading = false;
         }
        },
        error:() => {
          this.notifyService.showError("Image update was not successful", "Error");
          this.uploading = false;
        }
      });
  }

  loadPaymentMethods() {
    this.loadingPaymentMethods = true;

    this.hackerService.getPaymentMethods().subscribe({
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
        this.showProficiencies = false;
        this.showNotification = false;
        this.showHelp = false;
        this.showDeleteAccount = false;
        break;
      case 1:
        this.showPaymentMethod = true;
        this.showUserInfo = false;
        this.showProficiencies = false;
        this.showNotification = false;
        this.showHelp = false;
        this.showDeleteAccount = false;
        break;
      case 2:
        this.showProficiencies = true;
        this.showUserInfo = false;
        this.showPaymentMethod = false;
        this.showNotification = false;
        this.showHelp = false;
        this.showDeleteAccount = false;
        break;
      case 3:
        this.showNotification = true;
        this.showProficiencies = false;
        this.showUserInfo = false;
        this.showPaymentMethod = false;
        this.showHelp = false;
        this.showDeleteAccount = false;
        break;
      case 4:
        this.showHelp = true;
        this.showNotification = false;
        this.showProficiencies = false;
        this.showUserInfo = false;
        this.showPaymentMethod = false;
        this.showDeleteAccount = false;
        break;
      case 5:
        this.showDeleteAccount = true;
        this.showHelp = false;
        this.showNotification = false;
        this.showProficiencies = false;
        this.showUserInfo = false;
        this.showPaymentMethod = false;
        break;
    
      default:
        break;
    }
  }

  editPaymentMethod(paymentMethod: any) {
    const dialogRef = this.dialog.open(EditPaymentMethodDialogComponent, {
      data: paymentMethod,
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

  removePaymentMethod(id: any) {
    this.alertService.confirm().then((result) => {
      if (result.value) {
        this.hackerService.removePaymentMethod(id).subscribe({
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
      'We will immediately delete all of your reports, along with all of your comments on projects. You will no longer be billed, and after 90 days your username will be available to anyone on BugBountyBox.',
      'Please add your reason',
      'Delete this account',
    ).then((result) => {
      if (!result) {
        this.alertService.error('Cancelled', 'Account deletion aborted.');
      }
      else if (result) {
        this.hackerService.deleteAccount(result).subscribe({
          next:() => this.oidcSecurityService.logoff(constants.HACKER),
          error:() => this.alertService.error('Something went wrong', 'Account deletion aborted.')
        });
      }
    })
  }

  loadProficiencies() {
    this.loadingProficiencies = true;

    this.hackerService.getProficiencies().subscribe({
      next: (result) => {
        this.proficiencies = result.data;
        this.loadingProficiencies = false;
      },
      error: (error) => {
        this.loadingProficiencies = false;
        this.notifyService.showError("Something went wrong", "Error");
      },
    });
  }

  saveProficiency() {
    this.updateLoading = true;
    this.hackerService.updateProficiencies(this.proficiencyRatings).subscribe({
      next:result => {
        const user = JSON.stringify(result);
        const encodedData = this.encodeService.encode(user);
        localStorage.setItem(environment.me, encodedData);
        this.updateLoading = false;  
        this.notifyService.showSuccess("Proficiency updated successfully", "Success");
        this.loadHacker();
      },
      error:() => {
        this.updateLoading = false;
        this.notifyService.showError('Something went wrong updating proficiency, please try again', 'Error');
      },
    })
  }

  handleMouseOver(highlightedLevel: HTMLElement, index: number) {
    let levelsNodes = document.querySelectorAll('.levels');
    let levelNode = levelsNodes[index];
    let levels = levelNode.querySelectorAll('.level');
    let status = levelNode.querySelector('.status');
    // let status = document.querySelector('.status');

    // Get surrounding boxes
    let previousSiblings = this.getPreviousSiblings(Array.from(levels), highlightedLevel);
    let nextSiblings = this.getNextSiblings(Array.from(levels), highlightedLevel);

    // Mark previous boxes as highlighted
    this.setClass(previousSiblings, 'highlighted');

    // If any of the next boxes are marked as selected, decrease their opacity
    if (nextSiblings.length > 0) {
      let selectedNextSiblings = nextSiblings.filter(nextSibling => nextSibling.classList.contains('selected'));
      if (selectedNextSiblings.length > 0) {
        this.setClass(selectedNextSiblings, 'dimmed');
      }
    }

    // Change text to match currently highlighted boxes
    this.setStatusText(status, highlightedLevel.dataset['value']);
  }

  handleMouseLeave(highlightedLevel: HTMLElement, index: number) {
    let levelsNodes = document.querySelectorAll('.levels');
    let levelNode = levelsNodes[index];
    let levels = levelNode.querySelectorAll('.level');
    let status = levelNode.querySelector('.status');
    // let status = document.querySelector('.status');

    this.removeClass(Array.from(levels), 'dimmed');

    // Get surrounding boxes
    let previousSiblings = this.getPreviousSiblings(Array.from(levels), highlightedLevel);

    // Mark previous boxes as unhighlighted
    this.removeClass(previousSiblings, 'highlighted');

    // Change text to match currently highlighted boxes
    let activeLevels = levelNode.querySelectorAll('.selected');
    if (activeLevels.length == 0) {
      this.setStatusText(status, '1');
    } else {
      this.setStatusText(status, activeLevels.length.toString());
    }
  }

  handleLevelClick(selectedLevel: HTMLElement, index: number) {
    let levelsNodes = document.querySelectorAll('.levels');
    let levelNode = levelsNodes[index];
    let levels = levelNode.querySelectorAll('.level');

    
    this.removeClass(Array.from(levels), 'selected');
    
    let previousSiblings = this.getPreviousSiblings(Array.from(levels), selectedLevel);
    
    this.setClass(previousSiblings, 'selected');
    
    let selectedLevels = levelNode.querySelectorAll('.selected');
    let proficiencyType = levelNode.id;
    let proficiencyLevel = Array.from(selectedLevels).length.toString();

    let proficiencyRating = {
      type: proficiencyType,
      level: proficiencyLevel
    }

    let proficiency = this.proficiencyRatings.find(x => x.type == proficiencyRating.type);

    if(proficiency)
      proficiency.level =  proficiencyRating.level;
    else
      this.proficiencyRatings.push(proficiencyRating);

//    console.log(this.proficiencyRatings);
  }

  // <------------ Helpers ------------>
  getPreviousSiblings(levels: any[], highlightedLevel: HTMLElement) {
    let previousSiblings = levels.filter(level => parseInt(level.dataset.value) <= parseInt(highlightedLevel.dataset['value'] as string));
    return previousSiblings;
  }

  getNextSiblings(levels: any[], highlightedLevel: HTMLElement) {
    let nextSiblings = levels.filter(level => parseInt(level.dataset.value) > parseInt(highlightedLevel.dataset['value'] as string));
    return nextSiblings;
  }

  removeClass(levels: any[], className: string) {
    levels.forEach(level => {
      level.classList.remove(className);
    });
  }

  setClass(levels: any[], className: string) {
    levels.forEach(sibling => {
      sibling.classList.remove(className);
      sibling.classList.add(className);
    });
  }
  
  setStatusText(status: Element | null, key: string | undefined) {
    if(status && key){
      status.textContent = this.proficiencyLevelMap[key];
    }
  }

}