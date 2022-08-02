import { Component, Inject, NgZone } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { DOCUMENT } from '@angular/common';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { HackerService } from 'src/app/core/_services/hacker.service';
import { merge, Observable, of } from 'rxjs';
import { AdminService } from 'src/app/core/_services/admin.services';
import { VulnerabilitiesResponseJSON } from 'src/app/core/_models/vulnerabilitiesResponseJSON';
import { AdminVulnerabilityDialogComponent } from '../admin-vulnerability-dialog/admin-vulnerability-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { UpdateVulnerabilityComponent } from '../update-vulnerability/update-vulnerability.component';
import { DeleteVulnerabilityComponent } from '../delete-vulnerability/delete-vulnerability.component';
import { NotificationService } from 'src/app/core/_services/notification.service';

@Component({
  selector: 'app-vulnerabilities',
  templateUrl: './vulnerabilities.component.html',
  styleUrls: ['./vulnerabilities.component.css']
})
export class VulnerabilitiesComponent {
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
  loadingVulnerabilities: boolean = true;
  filteredString:string = '';
  allVulnerabilities:VulnerabilitiesResponseJSON[] = [];
  totalCount?:number;
  pageSize:number = 5;
  page:number = 1;
  vulnerabilitTypes: any;

  constructor(
    @Inject(DOCUMENT) public document: Document,
    public oidcSecurityService: OidcSecurityService,
    public hackerService: HackerService,
    public notifyService: NotificationService,
    private adminService:AdminService,
    public dialog: MatDialog,
  ) {

  }

  async ngOnInit(): Promise<void> {
    this.getAllVulnerabilites();
	}
  
  getAllVulnerabilites(){
    this.loadingVulnerabilities = true;
    this.adminService.getVulnerabilitiesFromAdmin().subscribe({
      next: results => {
        this.allVulnerabilities = results.result.data; 
        this.totalCount = results.result.totalCount;
        this.loadingVulnerabilities = false;
        //console.log(results);
      },
      error: () => {
        this.notifyService.showError("Something went wrong, please try again", "Error");
        this.loadingVulnerabilities = false;
      }
    })
  }

  AddVulnerability(){
    let dialogRef = this.dialog.open(AdminVulnerabilityDialogComponent, {
      height: '500px',
      width: '600px',
    });

    dialogRef.afterClosed().subscribe(res => {
      // received data from dialog-component
      //    console.log(res.data);
      if(res.data.type !== ''||res.data.type !== null || res.data.type !== undefined){
        this.allVulnerabilities.push(res.data); 
      }
      
    })
  }

  UpdateVulnerability(id:number){
    let dialogRef = this.dialog.open(UpdateVulnerabilityComponent, {
      data:id,
      height: '500px',
      width: '600px',
    });

    dialogRef.afterClosed().subscribe(res => {
      // received data from dialog-component
      //    console.log(res.data);
      this.allVulnerabilities.forEach(e => {
        if(e.id === res.data.id){
          e.type = res.data.type
        }
      })
    })
  }

  DeleteVulnerability(id:number){
    let dialogRef = this.dialog.open(DeleteVulnerabilityComponent, {
      data:id,  
      height: '500px',
      width: '600px',
    });

    dialogRef.afterClosed().subscribe(res => {
      // received data from dialog-component
      //    console.log(res.data);
      this.allVulnerabilities = this.allVulnerabilities.filter(e => e.id !== res.data);
    })
  }

  toggleSideNav() {
    this.sideNavOpened = !this.sideNavOpened;
  }

  logout() {
    this.oidcSecurityService.logoff();
  }
}
