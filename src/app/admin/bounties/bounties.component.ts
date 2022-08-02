import { Component, Inject, NgZone } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { DOCUMENT } from '@angular/common';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { HackerService } from 'src/app/core/_services/hacker.service';
import { merge, Observable, of } from 'rxjs';
import { VulnerabilitiesResponseJSON } from 'src/app/core/_models/vulnerabilitiesResponseJSON';
import { AdminService } from 'src/app/core/_services/admin.services';
import { PayoutStatsJson } from 'src/app/core/_models/PayoutStatsJson';
import { VulnerabilityStatsJSON } from 'src/app/core/_models/vulnerabilityStatsJson';

@Component({
  selector: 'app-bounties',
  templateUrl: './bounties.component.html',
  styleUrls: ['./bounties.component.css']
})
export class BountiesComponent {
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
  bountyBySeverity?:PayoutStatsJson;
  filteredString:string = '';
  allvulnReports:VulnerabilityStatsJSON[] = [];
  allVulnerabilities:VulnerabilitiesResponseJSON[] = [];
  totalCount:number = 0;
  totalBounties:number = 0;
  pageSize:number = 5;
  page:number = 1;

  constructor(
    @Inject(DOCUMENT) public document: Document,
    public oidcSecurityService: OidcSecurityService,
    public hackerService: HackerService,
    private adminService:AdminService,
  ) {

  }

  async ngOnInit(): Promise<void> {
    this.loading = true;
    this.getAllVulnerabilities();  
    this.getBountyBySeverity();
    this.getVulnPayoutAndReport();
	}

  getAllVulnerabilities(){
    this.adminService.getVulnerabilitiesFromAdmin().subscribe(
      results => {
        this.allVulnerabilities = results.result.data;
    //    console.log(this.allVulnerabilities);
        this.allVulnerabilities.forEach(vulnerability => {
          this.allvulnReports.forEach(vulnReports => {
            if(vulnerability.type === vulnReports.vulnerability){
              vulnerability.bugReportCount = vulnReports.bugReportCount;
              vulnerability.totalAmount = vulnReports.totalAmount;
              // this.totalBounties += vulnReports.totalAmount;
            }
          })
        })
      }
    )
  }

  getVulnPayoutAndReport(){
    this.adminService.getVulnerabilityPayoutStats().subscribe(
      results => {
        this.allvulnReports = results.result;
        this.totalCount = results.result.totalCount;
        this.allVulnerabilities.forEach(vulnerability => {
          this.allvulnReports.forEach(vulnReports => {
            if(vulnerability.type === vulnReports.vulnerability){
              vulnerability.bugReportCount = vulnReports.bugReportCount;
              vulnerability.totalAmount = vulnReports.totalAmount;
              this.totalBounties += vulnReports.totalAmount;
            }
          })
        })
    //    console.log(this.allvulnReports);  
      }
    )
  }

  getBountyBySeverity(){
    this.adminService.BountyBySeverity().subscribe(
      results => {
        this.bountyBySeverity = results.result;
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
