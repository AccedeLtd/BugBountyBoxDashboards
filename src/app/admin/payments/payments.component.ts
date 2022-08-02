import { Component, Inject, NgZone } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { DOCUMENT } from '@angular/common';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { HackerService } from 'src/app/core/_services/hacker.service';
import { merge, Observable, of } from 'rxjs';
import { AdminService } from 'src/app/core/_services/admin.services';
import { UpcomingPaymentsJSON } from 'src/app/core/_models/upcomingPaymentsJSON';
import { UpcomingPaymentResponseJSON } from 'src/app/core/_models/upcomingPaymentResponseJSON';
import { AdminPaymentDialogComponent } from '../admin-payment-dialog/admin-payment-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import {AllProjectsResponseJson} from 'src/app/core/_models/allProjectsResponseJson';
import { BugReviewJsonList } from 'src/app/core/_models/BugReviewJsonList';

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
    this.loading = true;
    this.getUpComingPayments();
    this.getPastCustomerPayouts();  
    this.getActiveProjects();
    this.getAllBugsByAdmin();
	}

  getUpComingPayments(){
    this.adminService.getUpcomingPaymentsByAdmin().subscribe(
      results => {
    //    console.log(results);
        this.allUpCompingPayments = results.result.data;
        this.totalCount = results.result.totalCount;
        this.allUpCompingPayments.forEach(total => {
          this.totalPayout += total.amount;
        })
        this.allUpCompingPayments = this.allUpCompingPayments.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    //    console.log(this.allUpCompingPayments);
      }
    )
  }

  getPastCustomerPayouts(){
    this.adminService.getPastCustomerPayouts().subscribe(
      results => {
    //    console.log(results.result.data);
        this.pastCustomerPayments = results.result.data; 
        this.pastCustomerPayments.forEach(e => this.totalPastPayout += e.amount);
       
      }
    )
  }

  getAllBugsByAdmin(){
    this.adminService.getAllBugsByAdmin().subscribe(
      results => {
    //    console.log(results);
        this.validatedBugs = results.result.data;
        this.validatedBugs.forEach(e =>{
          if(e.status === 0){
            this.incomingPayments += e.projectBounty;
          }
          this.overallPayouts = this.totalPayout + this.totalPastPayout + this.pendingProjects + this.incomingPayments;
        })
      });
  }

  getActiveProjects(){
    this.adminService.getProjects().subscribe(
      results => {
    //    console.log(results);
        this.allProjects = results.data;
        this.allProjects.forEach(e => {
          if(e.projectStatus === 2){
            this.pendingProjects += e.bounty;
          }
        })
      }
    )
  }

  payout(vulnerability: any) {
    let dialogRef = this.dialog.open(AdminPaymentDialogComponent, {
      data: vulnerability,
      height: '500px',
      width: '600px',
    });
    dialogRef.afterClosed().subscribe(res => {
      // received data from dialog-component
  //    console.log(res.data);
      this.allUpCompingPayments = this.allUpCompingPayments.filter(e => e.id !== res.data);
      this.totalPayout = 0;
      this.totalPastPayout = 0
      this.allUpCompingPayments.forEach(e => {
        this.totalPayout += e.amount;
      })
      this.pastCustomerPayments.forEach(e => this.totalPastPayout -= e.amount);
    })
  }

  toggleSideNav() {
    this.sideNavOpened = !this.sideNavOpened;
  }

  logout() {
    this.oidcSecurityService.logoff();
  }
}
