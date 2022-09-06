import { Component, Inject, NgZone } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { DOCUMENT } from '@angular/common';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { HackerService } from 'src/app/core/_services/hacker.service';
import { forkJoin, merge, Observable, of } from 'rxjs';
import { AdminService } from 'src/app/core/_services/admin.services';
import { UpcomingPaymentsJSON } from 'src/app/core/_models/upcomingPaymentsJSON';
import { UpcomingPaymentResponseJSON } from 'src/app/core/_models/upcomingPaymentResponseJSON';
import { AdminPaymentDialogComponent } from '../admin-payment-dialog/admin-payment-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import {AllProjectsResponseJson} from 'src/app/core/_models/allProjectsResponseJson';
import { BugReviewJsonList } from 'src/app/core/_models/BugReviewJsonList';
import LoadStatus from 'src/app/core/_utils/LoadStatus';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css']
})
export class PaymentsComponent {
  sideNavOpened = false;  
  user: any;
  authUser: any;
  userName: any;
  loadStatus: LoadStatus = 'loading';
  totalPayout:number = 0;
  totalPastPayout:number = 0;
  pendingProjects:number = 0;
  incomingPayments:number = 0;
  overallPayouts:number = 0;
  allUpCompingPayments:UpcomingPaymentResponseJSON[] = []; 
  pastCustomerPayments:UpcomingPaymentResponseJSON[] = []; 
  allProjects:AllProjectsResponseJson[] = [];
  validatedBugs:BugReviewJsonList[] = [];
  totalCount?:number;
  pageSize:number = 5;
  page:number = 1;  

  constructor(
    @Inject(DOCUMENT) public document: Document,
    public oidcSecurityService: OidcSecurityService,
    public hackerService: HackerService,
    private adminService:AdminService,
    public dialog: MatDialog
  ) {

  }

  async ngOnInit(): Promise<void> {
    this.loadData();
	}

  loadData() {
    forkJoin({
      getUpcomingPaymentsByAdminResult: this.adminService.getUpcomingPaymentsByAdmin(),
      getPastCustomerPayoutsResult: this.adminService.getPastCustomerPayouts(),
      getProjectsResult: this.adminService.getProjects(),
      getAllBugsByAdminResult: this.adminService.getAllBugsByAdmin(),
    }).subscribe({
      next:({getUpcomingPaymentsByAdminResult, getPastCustomerPayoutsResult, getProjectsResult, getAllBugsByAdminResult}) => {
        this.getUpComingPayments(getUpcomingPaymentsByAdminResult);
        this.getPastCustomerPayouts(getPastCustomerPayoutsResult);
        this.getActiveProjects(getProjectsResult);
        this.getAllBugsByAdmin(getAllBugsByAdminResult);
        this.loadStatus = 'success';
      },
      error: () => (this.loadStatus = 'error'),
    })
  }

  getUpComingPayments(results: any) {
    this.allUpCompingPayments = results.result.data;
    this.totalCount = results.result.totalCount;
    this.allUpCompingPayments.forEach(total => {
      this.totalPayout += total.amount;
    })
    this.allUpCompingPayments = this.allUpCompingPayments.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  getPastCustomerPayouts(results: any) {
    this.pastCustomerPayments = results.result.data; 
    this.pastCustomerPayments.forEach(e => this.totalPastPayout += e.amount);
  }

  getAllBugsByAdmin(results: any) {
    this.validatedBugs = results.result.data;
    this.validatedBugs.forEach(e =>{
      if(e.status === 0){
        this.incomingPayments += e.projectBounty;
      }
      this.overallPayouts = this.totalPayout + this.totalPastPayout + this.pendingProjects + this.incomingPayments;
    })
  }

  getActiveProjects(results: any) {
    this.allProjects = results.data;
    this.allProjects.forEach(e => {
      if(e.projectStatus === 2){
        this.pendingProjects += e.bounty;
      }
    })
  }

  payout(vulnerability: any) {
    let dialogRef = this.dialog.open(AdminPaymentDialogComponent, {
      data: vulnerability,
      height: '500px',
      width: '600px',
    });

    dialogRef.afterClosed().subscribe(res => {
      if(res?.data) this.loadData();
    })
  }

  toggleSideNav() {
    this.sideNavOpened = !this.sideNavOpened;
  }

  logout() {
    this.oidcSecurityService.logoff();
  }
}
