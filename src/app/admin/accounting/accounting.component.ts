import { Component, Inject, NgZone } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { ProjectDetailsDialogComponent } from './project-details-dialog/project-details-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CustomerService } from 'src/app/core/_services/customer.service';
import { NotificationService } from 'src/app/core/_services/notification.service';
import { PaymentMethodPlatform } from 'src/app/core/_enums/paymentMethodPlatform';
import { TransactionStatus } from 'src/app/core/_enums/transactionStatus';
import { AdminService } from 'src/app/core/_services/admin.services';
import { forkJoin } from 'rxjs';
import LoadStatus from 'src/app/core/_utils/LoadStatus';

@Component({
  selector: 'app-accounting',
  templateUrl: './accounting.component.html',
  styleUrls: ['./accounting.component.css']
})
export class AccountingComponent {
  sideNavOpened = false;

  sections = [
    { id: '', title: 'Dashboard', active: false },
    { id: '/payments', child: '/payments/details', title: 'Payments', active: false },
    { id: '/bounties', title: 'Bounties', active: false },
    { id: '/clients', title: 'Clients', active: false },
    { id: '/vulnerabilities', title: 'Vulnerabilities', active: false },
    { id: '/bugs', child: '/bugs/details', title: 'Bugs', active: false },
    { id: '/projects', child: '/projects/details', title: 'Projects', active: false },
    { id: '/hackers', child: '/bounty-activity/details', title: 'Hackers', active: false },
  ];
  
  bountyAwarded: number = 0;
  payments: any[] = [];
  paymentsConfig = {
    id: 'paymentsConfig',
    itemsPerPage: 4,
    currentPage: 1
  };
  transactionsConfig = {
    id: 'transactionsConfig',
    itemsPerPage: 4,
    currentPage: 1
  };
  transactions: any[] = [];
  PaymentMethodPlatform = PaymentMethodPlatform;
  TransactionStatus = TransactionStatus;
  transactionsMetrics: any;
  loadStatus: LoadStatus = 'loading';

  constructor(
    @Inject(DOCUMENT) public document: Document,
    public oidcSecurityService: OidcSecurityService,
    public adminService: AdminService,
    public notifyService: NotificationService,
    public dialog: MatDialog,
  ) {

  }

  ngOnInit(): void {
    this.loadData();
	}

  loadData() {
    this.loadStatus = 'loading';

    forkJoin({
      paymentsResult: this.adminService.getPastCustomerPayouts(),
      transactionsResult: this.adminService.getTransactions(),
      transactionsMetrics: this.adminService.getTransactionsMetrics()
    }).subscribe({
      next:({paymentsResult, transactionsResult, transactionsMetrics}) => {
        this.payments = paymentsResult.result.data;
        this.transactions = transactionsResult.data;
        this.transactionsMetrics = transactionsMetrics;

        this.loadStatus = 'success';
      },
      error: () => (this.loadStatus = 'error'),
    })
  }

  toggleSideNav() {
    this.sideNavOpened = !this.sideNavOpened;
  }

  logout() {
    this.oidcSecurityService.logoff();
  }

  showPaymentDetails(payment: any) {
    this.dialog.open(ProjectDetailsDialogComponent, {
      // height: '400px',
      width: '700px',
    });
  }
  
  showTransactionDetails(payment?: any) {
    this.dialog.open(ProjectDetailsDialogComponent, {
      // height: '400px',
      width: '700px',
    });
  }
}
