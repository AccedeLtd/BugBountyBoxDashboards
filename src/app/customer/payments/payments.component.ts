import { Component, Inject, NgZone } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { DOCUMENT } from '@angular/common';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { HackerService } from 'src/app/core/_services/hacker.service';
import { merge, Observable, of } from 'rxjs';
import { CustomerService } from 'src/app/core/_services/customer.service';
import { NotificationService } from 'src/app/core/_services/notification.service';
import { WalletsService } from 'src/app/core/_services/wallets.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css']
})
export class PaymentsComponent {
  sideNavOpened = false;

  sections = [
    { id: '', title: 'Dashboard', active: false },
    { id: '/payments', child: '/payments/details', title: 'Payments', active: false },
    { id: '/bounties', title: 'Bounties', active: false },
    { id: '/clients', title: 'Clients', active: false },
    { id: '/vulnerabilities', title: 'Vulnerabilities', active: false },
    { id: '/bugs', child: '/bugsy/details', title: 'Bugs', active: false },
    { id: '/projects', child: '/projects/details', title: 'Projects', active: false },
    { id: '/hackers', child: '/bounty-activity/details', title: 'Hackers', active: false },
  ];
  
  user: any;
  authUser: any;
  userName: any;
  loading: boolean = true;
  loadingPayments: boolean = true;
  totalCount:number = 0;
  pageSize:number = 12;
  page:number = 1;
  paymentsQuery: any = '';
  payments: any;
  walletBalance: any;
  totalPayments: any;
  pendingPayouts: any;

  constructor(
    @Inject(DOCUMENT) public document: Document,
    public oidcSecurityService: OidcSecurityService,
    public customerService: CustomerService,
    public walletsService: WalletsService,
    public notifyService: NotificationService,
  ) {

  }

  async ngOnInit(): Promise<void> {
    this.loadWalletBalance();
    this.loadPayments();
	}

  loadWalletBalance() {
    //TODO: use RxJS
    this.walletsService.getWalletBalance().subscribe(
			result => {
        this.walletBalance = result.balance;
			}
		)
  }

  loadPayments() {
    this.loadingPayments = true;
    this.customerService.getPayouts().subscribe({
			next: result => {
        this.payments = result.data;
        const groupedByTransactionStatus = _.groupBy(result.data, data => data.status);

        const pendingTransactions = groupedByTransactionStatus['0'] || [];//ProjectStatus Enum
        const completedTransactions = groupedByTransactionStatus['1'] || [];//ProjectStatus Enum

        this.totalPayments = completedTransactions.reduce((n: any, {amount}: any) => n + amount, 0);
        this.pendingPayouts = pendingTransactions.reduce((n: any, {amount}: any) => n + amount, 0);
        this.totalCount = result.data.totalCount;
        this.loadingPayments = false;
      },
      error: error => {
        this.notifyService.showError('Something went wrong, please try again', 'Error');
      }
    }
    )
  }

  toggleSideNav() {
    this.sideNavOpened = !this.sideNavOpened;
  }

  logout() {
    this.oidcSecurityService.logoff();
  }
}
