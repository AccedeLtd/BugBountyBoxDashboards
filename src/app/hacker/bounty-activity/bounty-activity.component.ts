import { Component, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { HackerService } from 'src/app/core/_services/hacker.service';

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
  loadingBounties: boolean = true;
  bounties: any;
  loadingBountyActivity: boolean = true;
  bountyActivities: any;
  bountyActivitiesQuery: any = '';

  constructor(
    @Inject(DOCUMENT) public document: Document,
    public hackerService: HackerService,
    public oidcSecurityService: OidcSecurityService,
  ) {

  }

  async ngOnInit(): Promise<void> {
    this.loading = true;
		this.getBountyActivity();
	}

  getBountyActivity() {
    this.loadingBountyActivity = true;

    this.hackerService.getBountyActivity().subscribe(
      result => {
        this.bountyActivities = result.data;
        this.loadingBountyActivity = false;
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