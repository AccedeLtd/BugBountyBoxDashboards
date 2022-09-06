import { Component, Inject, NgZone } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { DOCUMENT } from '@angular/common';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { HackerService } from 'src/app/core/_services/hacker.service';
import { forkJoin, merge, Observable, of } from 'rxjs';
import { VulnerabilitiesResponseJSON } from 'src/app/core/_models/vulnerabilitiesResponseJSON';
import { AdminService } from 'src/app/core/_services/admin.services';
import { PayoutStatsJson } from 'src/app/core/_models/PayoutStatsJson';
import { VulnerabilityStatsJSON } from 'src/app/core/_models/vulnerabilityStatsJson';
import LoadStatus from 'src/app/core/_utils/LoadStatus';

@Component({
  selector: 'app-bounties',
  templateUrl: './bounties.component.html',
  styleUrls: ['./bounties.component.css']
})
export class BountiesComponent {
  sideNavOpened = false;  
  user: any;
  authUser: any;
  userName: any;
  loadStatus: LoadStatus = 'loading';
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
    this.loadData();
	}

  loadData() {
    forkJoin({
      getVulnerabilityPayoutStatsResult: this.adminService.getVulnerabilityPayoutStats(),
      getBountyBySeverityResult: this.adminService.BountyBySeverity(),
    }).subscribe({
      next: ({getVulnerabilityPayoutStatsResult, getBountyBySeverityResult}) => {
        this.allVulnerabilities = getVulnerabilityPayoutStatsResult.result;
        this.bountyBySeverity = getBountyBySeverityResult.result;
        const values: number[] = Object.values(getBountyBySeverityResult.result);
        this.totalBounties = values.reduce((a: any, b: any) => a+b, 0);
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
}
