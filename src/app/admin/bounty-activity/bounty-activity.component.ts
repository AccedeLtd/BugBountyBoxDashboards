import { Component, Inject } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { DOCUMENT } from '@angular/common';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { HackerService } from 'src/app/core/_services/hacker.service';
import { ProjectsService } from 'src/app/core/_services/projects.service';
import { CustomerService } from 'src/app/core/_services/customer.service';
import { MatDialog } from '@angular/material/dialog';
import * as _ from 'lodash';
import { AdminService } from 'src/app/core/_services/admin.services';
import { AdminPaymentDialogComponent } from '../admin-payment-dialog/admin-payment-dialog.component';
import { UpcomingPaymentsJSON } from 'src/app/core/_models/upcomingPaymentsJSON';
import { ValidateProjectDialogComponent } from '../validate-project-dialog/validate-project-dialog.component';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];

@Component({
  selector: 'app-bounty-activity',
  templateUrl: './bounty-activity.component.html',
  styleUrls: ['./bounty-activity.component.css']
})
export class BountyActivityComponent {
  searchInput!: string;
  sideNavOpened = false;

  sections = [
    { id: '', title: 'Dashboard', active: false },
    { id: '/projects', child: '/projects/details', title: 'Projects', active: false },
    { id: '/bounty-activity', child: '/bounty-activity/details', title: 'Bounty Activity', active: false },
    { id: '/payments', child: '/payments/details', title: 'Payments', active: false },
  ];

  user: any;
  authUser: any;
  userName: any;
  loading: boolean = true;
  loadingBugs: boolean = true;
  loadingVulnerabilities: boolean = true;
  bugs: any;
  vTotalCount:number = 0;
  vPageSize:number = 5;
  vPage:number = 1;
  oTotalCount:number = 0;
  oPageSize:number = 5;
  oPage:number = 1;
  cTotalCount:number = 0;
  cPageSize:number = 5;
  cPage:number = 1;    

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;
  vulnerabilities: any;
  openVulnerabilities: any[] = [];
  validatedVulnerabilities: any[] = [];
  closedVulnerabilities: any[] = [];
  upcoming:UpcomingPaymentsJSON[] = [];
  filteredString:string = ''; 

  constructor(
    @Inject(DOCUMENT) public document: Document,
    public hackerService: HackerService,
    public oidcSecurityService: OidcSecurityService,
    public adminService:AdminService,
    public dialog: MatDialog,
  ) {

  }

  async ngOnInit(): Promise<void> {
    this.loading = true;
		this.loadVulnerabilities();
    this.getUpcomingPayments();
	}



  loadBugs() {
    this.loadingBugs = true;

    const body = {
      maxResultCount: 8,
      skipCount: 0,
      from: undefined,
      to: undefined,
      organizationId: undefined,
      organizationSearchText: '',
      minimumBounty: undefined,
      maximumBounty: undefined
    }

    this.adminService.getBugs().subscribe(
      result => {
    //    console.log(result);
        this.bugs = result;
        this.loadingBugs = false;
      }
    )
  }
  
  loadVulnerabilities() {
    this.loadingVulnerabilities = true;

    this.adminService.getAllBugsByAdmin().subscribe(
      results => {
        //    console.log(results);
        this.vulnerabilities = results.result.data;
        const vulnerabilitiesByStatus = _.groupBy(results.result.data, data => data.status);
        
        this.openVulnerabilities = vulnerabilitiesByStatus['0'] || [];
        this.oTotalCount = this.openVulnerabilities.length;
        this.validatedVulnerabilities = vulnerabilitiesByStatus['1'] || [];
        this.vTotalCount = this.validatedVulnerabilities.length;
        this.closedVulnerabilities = vulnerabilitiesByStatus['2'] || [];
        this.cTotalCount = this.closedVulnerabilities.length;
        this.loadingVulnerabilities = false;   
        //    console.log(see); 
        //    console.log(this.oTotalCount,this.cTotalCount,this.vTotalCount);
        
      }
    )
  }

  toggleSideNav() {
    this.sideNavOpened = !this.sideNavOpened;
  }

  logout() {
    this.oidcSecurityService.logoff();
  }

  payout(vulnerability: any) {
    this.dialog.open(AdminPaymentDialogComponent, {
      data: vulnerability,
      height: '500px',
      width: '600px',
    });
  }

  getUpcomingPayments(){
    this.adminService.getUpcomingPaymentsByAdmin().subscribe(
      results => {
        this.upcoming = results.result;
    //    console.log(`real upcoming: ${JSON.stringify(this.upcoming)}`);
      }
    )
  }
}