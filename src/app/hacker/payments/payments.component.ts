import { Component, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { HackerService } from 'src/app/core/_services/hacker.service';
import { PaymentMethodDialogComponent } from '../settings/payment-method-dialog/payment-method-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogActions } from 'src/app/core/_enums/dialoagActions';
import { WithdrawDialogComponent } from '../settings/withdraw-dialog/withdraw-dialog.component';
import { ExportService } from 'src/app/core/_services/export.service';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css']
})
export class PaymentsComponent {
  searchInput!: string;
  sideNavOpened = false;
  user: any;
  authUser: any;
  userName: any;
  loading: boolean = true;
  loadingBounties: boolean = true;
  bounties: any;
  loadingWalletBalance: boolean = true;
  walletkey = '3Bwallet';
  walletBalance: string = '0.00';
  loadingUpcomingPayments: boolean = true;
  loadingPastPayments: boolean = true;
  upcomingPayments: any[] = [];
  pastPayments: any[] = [];

  constructor(
    @Inject(DOCUMENT) public document: Document,
    public hackerService: HackerService,
    public oidcSecurityService: OidcSecurityService,
    public exportService: ExportService,
    public dialog: MatDialog,
  ) {

  }

  async ngOnInit(): Promise<void> {
    this.loading = true;
		this.loadUser();
    // this.loadWalletBalance();
		this.loadUpcomingPayments();
		this.loadPastPayments();
	}

  loadUser() {
    this.hackerService.getHacker().subscribe(
			result => {
        this.user = result;

        if(result)
				  this.userName = result.userName;
        else
				  this.userName = this.authUser.userName;

        this.loading = false;
			}
		)
  }

  loadWalletBalance() {
    //TODO: use RxJS
    this.hackerService.getWalletBalance().subscribe(
			result => {
        this.walletBalance = result.balance;
        this.loadingWalletBalance = false;
			}
		)
  }

  loadUpcomingPayments() {
    this.loadingUpcomingPayments = true;
    this.hackerService.getUpcomingPayments().subscribe(
      result => {
    //    console.log(result);
        this.upcomingPayments = result.data;
        this.loadingUpcomingPayments = false;
			}
		)
  }
  
  loadPastPayments() {
    this.loadingPastPayments = true;
    this.hackerService.getPastPayments().subscribe(
      result => {
    //    console.log(result);
        this.pastPayments = result.data;
        this.loadingPastPayments = false;
			}
		)
  }

  withdraw() {
    const dialogRef = this.dialog.open(WithdrawDialogComponent, {
      height: '500px',
      width: '600px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result.event == DialogActions.Update){
        this.loadUpcomingPayments();
      }
    });
  }

  toggleSideNav() {
    this.sideNavOpened = !this.sideNavOpened;
  }

  logout() {
    this.oidcSecurityService.logoff();
  }

  openDialog() {
    this.dialog.open(PaymentMethodDialogComponent, {
      height: '500px',
      width: '400px',
    });
  }

  exportCsv(tableClass: string, fileName: string) {
    this.exportService.exportUnorderedListCsv(tableClass, fileName);
  }
}