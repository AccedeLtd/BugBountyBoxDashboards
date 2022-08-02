import { Component, Inject, NgZone } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { DOCUMENT } from '@angular/common';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { HackerService } from 'src/app/core/_services/hacker.service';
import { merge, Observable, of } from 'rxjs';
import { AdminService } from 'src/app/core/_services/admin.services';
import { Customer, ListCustomerProjectJson } from 'src/app/core/_models/listCustomerProjectJson';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatDialog } from '@angular/material/dialog';
import { BlockClientDialogComponent } from '../block-client-dialog/block-client-dialog.component';
import { NotificationService } from 'src/app/core/_services/notification.service';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent {
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
  loadingClients: boolean = true;
  customers:Customer[] = [];
  listProjects:ListCustomerProjectJson[] = [];
  totalAssets:number = 0;  
  filteredString:string = '';
  totalCount?:number;
  pageSize:number = 5;
  page:number = 1;
  checked:boolean = true;

  constructor(
    @Inject(DOCUMENT) public document: Document,
    public oidcSecurityService: OidcSecurityService,
    public hackerService: HackerService,
    private adminService:AdminService,
    public dialog: MatDialog,
    public notifyService: NotificationService,
  ) {

  }

  async ngOnInit(): Promise<void> {
    this.getAllCustomersFromAdmin(); 
    this.getAllProjects();
	}

  changedActivation(userId:string,id:number){  
    let dialogRef = this.dialog.open(BlockClientDialogComponent,{
      data:{
        userId,
        id
      },
      height: '500px',
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(res => {
      // received data from dialog-component
        this.getAllCustomersFromAdmin();
      
      
  //    console.log(`checked variable: ${this.checked}`);
  //    console.log(`data variable: ${res.data}`);
      
      
    })
  }
 
  getAllCustomersFromAdmin(){
    this.loadingClients = true;
    this.adminService.getCustomersFromAdmin().subscribe({
      next:results => {
        //    console.log(JSON.stringify(results));
        this.customers = results.result.data;
        this.totalCount = results.result.totalCount;
        //    console.log(this.totalCount);  
        this.customers.forEach(f => {
          this.listProjects.forEach(e => {
            if(e.customer.userId === f.userId){
              e.domains.forEach(_ => {
                this.totalAssets++;
              });
              f.assets = this.totalAssets;
              //    console.log(f.assets);
            }
          })
          this.totalAssets = 0;      
         } );

         this.loadingClients = false;
      },
      error: () => {
        this.notifyService.showError("Something went wrong, please try again", "Error");
        this.loadingClients = false;
      }
    }
    )
  }

  

  getAllProjects(){
    this.adminService.getProjects().subscribe(
      results => {
    //    console.log(results.data);
        this.listProjects = results.data;
        this.customers.forEach(f => {
          this.listProjects.forEach(e => {
            if(e.customer.userId === f.userId){
              e.domains.forEach(_ => {
                this.totalAssets++;
              });
              f.assets = this.totalAssets;
          //    console.log(f.assets);
            }
          })
          this.totalAssets = 0;      
         } );
       
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
