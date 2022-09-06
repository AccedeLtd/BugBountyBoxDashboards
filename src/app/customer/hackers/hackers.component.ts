import { Component, Inject, NgZone } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { DOCUMENT } from '@angular/common';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { HackerService } from 'src/app/core/_services/hacker.service';
import { merge, Observable, of } from 'rxjs';
import { CustomerService } from 'src/app/core/_services/customer.service';

@Component({
  selector: 'app-hackers',
  templateUrl: './hackers.component.html',
  styleUrls: ['./hackers.component.css']
})
export class HackersComponent {
  searchInput!: string;
  sideNavOpened = false;  
  user: any;
  authUser: any;
  userName: any;
  loading: boolean = true;
  loadingHackers: boolean = true;
  hackers: any;
  totalCount:number = 0;
  pageSize:number = 12;
  page:number = 1;
  hackersQuery: any = '';

  constructor(
    @Inject(DOCUMENT) public document: Document,
    public oidcSecurityService: OidcSecurityService,
    public customerService: CustomerService,
  ) {

  }

  async ngOnInit(): Promise<void> {
    this.loadHackerPayouts();
	}

  loadHackerPayouts() {
    this.loadingHackers = true;
    //TODO: use RxJS
    this.customerService.getPayouts().subscribe(
			result => {
        this.hackers = result.data;
        this.totalCount = result.data.totalCount;
        this.loadingHackers = false;
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
