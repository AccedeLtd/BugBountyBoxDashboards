import { Component, Inject, NgZone } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { DOCUMENT } from '@angular/common';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { HackerService } from 'src/app/core/_services/hacker.service';
import { merge, Observable, of } from 'rxjs';
import { AdminService } from 'src/app/core/_services/admin.services';
import { HackersRequestJson } from 'src/app/core/_models/hackersRequestJSON';
import { UpcomingPaymentResponseJSON } from 'src/app/core/_models/upcomingPaymentResponseJSON';
import { BugReviewJsonList } from 'src/app/core/_models/BugReviewJsonList';
import { BlockHackerDialogComponent } from '../block-hacker-dialog/block-hacker-dialog.component';

import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-hackers',
  templateUrl: './hackers.component.html',
  styleUrls: ['./hackers.component.css']
})
export class HackersComponent {
  sideNavOpened = false;
  user: any;
  authUser: any;
  userName: any;
  loading: boolean = true;
  filteredString:string = '';
  totalCount:number = 0;
  pageSize:number = 5;
  page:number = 1;
  allHackersFromAdmin:HackersRequestJson[] = [];
  allPastPayments:UpcomingPaymentResponseJSON[] = [];
  allBugs:BugReviewJsonList[] = [];
  allReports:number = 0; 
  hackerPastPayout:number = 0;
  level1:number = 0;
  level2:number = 0;
  level3:number = 0;
  level4:number = 0;
  level5:number = 0;

  constructor(
    @Inject(DOCUMENT) public document: Document,
    public oidcSecurityService: OidcSecurityService,
    public hackerService: HackerService,
    private adminService:AdminService,
    private dialog:MatDialog
  ) {

  }
hackerurl:string='assets/Profile-large.png';

  async ngOnInit(): Promise<void> {
    this.loading = true;
    this.getAllHackersFromAdmin();  
    this.getAllPastPayments(); 
    this.getAllBugsByAdmin();    
	}

  changedActivation(userId:string,id:number){  
    let dialogRef = this.dialog.open(BlockHackerDialogComponent,{
      data:{
        userId,
        id
      },  
      height: '500px',
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(res => {
      // received data from dialog-component
        this.getAllHackersFromAdmin();
      
      
  //    console.log(`data variable: ${res.data}`);
      
      
    })
  }

  getAllPastPayments(){
    this.adminService.getPastCustomerPayouts().subscribe(
      results => {
        this.allPastPayments = results.result.data;
    //    console.log(this.allPastPayments);   
       
      }
    )
  }

  getAllBugsByAdmin(){
    this.adminService.getAllBugsByAdmin().subscribe(
      results => {
        this.allBugs = results.result.data;
    //    console.log(this.allBugs);
        this.allHackersFromAdmin.forEach(hacker => {
          this.allBugs.forEach(bugs => {
            if(bugs.hacker.userId === hacker.userId)
            {
              this.allReports += 1;
              hacker.reports = this.allReports; 
            }
          })
          this.allReports = 0; 
        });

           

      }
    )
  }
  getAllHackersFromAdmin(){
    this.adminService.getAllHackersFromAdmin().subscribe(
      results => {
        this.totalCount = results.result.totalCount;
    //    console.log(this.totalCount);
        this.allHackersFromAdmin = results.result.data;
    //    console.log(this.allHackersFromAdmin);
        this.allHackersFromAdmin.forEach(hacker => {
          this.allPastPayments.forEach(pastPayment => {
            if(pastPayment.project.hackerUserId === hacker.userId){
              this.hackerPastPayout += pastPayment.amount;
              hacker.payout = this.hackerPastPayout;
            }
          })
          this.hackerPastPayout = 0;
        });
        this.allHackersFromAdmin.forEach(hacker => {
          if(hacker.level === "1"){
            this.level1++;
          }
          if(hacker.level === "2"){
            this.level2++;
          }
          if(hacker.level === "3"){
            this.level3++;
          }
          if(hacker.level === "4"){
            this.level4++;
          }
          if(hacker.level === "5"){
            this.level5++;
          }
        })
        this.loading = !this.loading;
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
