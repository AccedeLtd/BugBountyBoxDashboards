import { Component, Inject, NgZone } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { DOCUMENT } from '@angular/common';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { HackerService } from 'src/app/core/_services/hacker.service';
import { merge, Observable, of } from 'rxjs';

@Component({
  selector: 'app-hackers-detail',
  templateUrl: './hackers-detail.component.html',
  styleUrls: ['./hackers-detail.component.css']
})
export class HackersDetailComponent {
  sideNavOpened = false;  
  user: any;
  authUser: any;
  userName: any;
  loading: boolean = true;

  constructor(
    @Inject(DOCUMENT) public document: Document,
    public oidcSecurityService: OidcSecurityService,
    public hackerService: HackerService,
  ) {

  }

  async ngOnInit(): Promise<void> {
    this.loading = true;
    this.authUser = await this.hackerService.getUser().toPromise();
	}

  toggleSideNav() {
    this.sideNavOpened = !this.sideNavOpened;
  }

  logout() {
    this.oidcSecurityService.logoff();
  }
  
  getAvatar() {
    return this.user ? this.user.image != null ? this.user.image : this.authUser.avatar != null ? this.authUser.avatar : `https://ui-avatars.com/api/?name=${this.userName}` : `https://ui-avatars.com/api/?name=${this.userName}`;
  }

  getCountry() {
    return this.user ? this.user.country != null ? this.user.country : this.authUser.countryOfResidence != null ? this.authUser.countryOfResidence : '-' : '-';
  }
}
