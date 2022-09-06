import { Component, Inject, NgZone } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { ProjectDetailsDialogComponent } from './project-details-dialog/project-details-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CustomerService } from 'src/app/core/_services/customer.service';
import { NotificationService } from 'src/app/core/_services/notification.service';
import { PaymentMethodPlatform } from 'src/app/core/_enums/paymentMethodPlatform';
import { TransactionStatus } from 'src/app/core/_enums/transactionStatus';
import { HackerService } from 'src/app/core/_services/hacker.service';
import { forkJoin } from 'rxjs';
import LoadStatus from 'src/app/core/_utils/LoadStatus';

@Component({
  selector: 'app-accounting',
  templateUrl: './accounting.component.html',
  styleUrls: ['./accounting.component.css']
})
export class AccountingComponent {
  sideNavOpened = false;  
  user: any;
  authUser: any;
  userName: any;
  loading: boolean = true;
  loadingAccountingStats: boolean = true;
  bountyAwarded: number = 0;
  loadingPayments: boolean = true;
  payments: any[] = [];
  loadingTransactions: boolean = true;
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
    public hackerService: HackerService,
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
      paymentsResult: this.hackerService.getPastPayments(),
      transactionsResult: this.hackerService.getTransactions(),
      transactionsMetrics: this.hackerService.getTransactionsMetrics()
    }).subscribe({
      next:({paymentsResult, transactionsResult, transactionsMetrics}) => {
        this.payments = paymentsResult.data;
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
