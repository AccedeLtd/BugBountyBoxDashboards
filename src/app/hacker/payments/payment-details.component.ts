import { Component, Inject } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { DOCUMENT } from '@angular/common';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { HackerService } from 'src/app/core/_services/hacker.service';

@Component({
  selector: 'app-payment-details',
  templateUrl: './payment-details.component.html',
  styleUrls: ['./payment-details.component.css']
})
export class PaymentDetailsComponent {
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
  loadingBounties: boolean = true;
  bounties: any;

  constructor(
    @Inject(DOCUMENT) public document: Document,
    public oidcSecurityService: OidcSecurityService,
    public hackerService: HackerService,
  ) {

  }

  async ngOnInit(): Promise<void> {
    this.loading = true;
		this.getBounties();
	}

  getUser() {    
    this.hackerService.getHacker().subscribe(
			result => {
        this.user = result;

        if(result)
				  this.userName = result.userName;
        else
				  this.userName = this.authUser.userName;

        this.loading = false;
			}
		)
  }

  getBounties() {
    this.loadingBounties = true;
    setTimeout(() => {
      this.loadingBounties = false;
    }, 2000);

    // const body = {
    //   maxResultCount: 8,
    //   skipCount: 0,
    //   from: undefined,
    //   to: undefined,
    //   organizationId: undefined,
    //   organizationSearchText: '',
    //   minimumBounty: undefined,
    //   maximumBounty: undefined
    // }

    // this.projectsService.getProjects(body).subscribe(
    //   result => {
    //     this.bounties = result.items;
    //     this.loadingBounties = false;
    //   }
    // )
  }

  toggleSideNav() {
    this.sideNavOpened = !this.sideNavOpened;
  }

  logout() {
    this.oidcSecurityService.logoff();
  }
}