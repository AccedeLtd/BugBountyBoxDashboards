import { Component, EventEmitter, Inject, NgZone, Output } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Router } from '@angular/router';
import { HackerService } from 'src/app/core/_services/hacker.service';
import { environment } from 'src/environments/environment';
import { EncodeService } from 'src/app/core/_services/encode.service';
import { ConfigService } from 'src/app/core/_services/config.service';
import { ProfileService } from 'src/app/core/_services/profile.service';
import { ProfileState } from 'src/app/core/_enums/profileState';
import { constants } from 'src/app/core/_utils/const';

@Component({
  selector: 'app-settings-nav',
  templateUrl: './settings-nav.component.html',
  styleUrls: ['./settings-nav.component.css']
})
export class SettingsNavComponent {
  searchInput!: string;
  sideNavOpened = false;
  private _mql!: MediaQueryList;
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
  @Output() sideNavToggleEvent = new EventEmitter<boolean>();

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  
  configId: string | undefined;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private _ngZone: NgZone,
    @Inject(DOCUMENT) public document: Document,
    public oidcSecurityService: OidcSecurityService,
    public router: Router,
    public hackerService: HackerService,
    public encodeService: EncodeService,
    public configService: ConfigService,
    public profileService: ProfileService,
  ) {

  }

  async ngOnInit(): Promise<void> {
    this._mql = window.matchMedia('(min-width:1024px)');
    this._mql.onchange = (e) => {
      if (e.matches) {
        this._ngZone.run(() => (this.sideNavOpened = false));
      }
    };

    this.sections.forEach((s) => {
      const route = this.router.url.replace('/hacker', '');
      s.active = route == s.id || route == s.child;
    });

    this.checkUserProfile();

    this.profileService.updateSubject.subscribe({
      next: (data) => {
        if(data == ProfileState.Load) {
          this.checkUserProfile();
        }
        else if(data == ProfileState.Update) {
          this.getUser();
        }
      }
    })
  }

  ngOnDestroy(): void {
    this._mql.onchange = null;
  }

  toggleSideNav() {
    this.sideNavToggleEvent.emit();
  }

  search() {
//    console.log(this.searchInput);
  }

  logout() {
    this.oidcSecurityService.logoff(constants.HACKER);
    this.configService.clear();
  }

  checkUserProfile() {
    let decodedData = null;
    localStorage.removeItem('dp');
    localStorage.removeItem('un');
    localStorage.removeItem('3b.me');
    const me = localStorage.getItem(environment.me);
    if(me) decodedData = this.encodeService.decode(me);

    if(decodedData) {
      const user = JSON.parse(decodedData);
      const authUser = this.oidcSecurityService.getUserData('hacker');
      if(user.email == authUser.email || user.userName == authUser.preferred_username) {
        this.user = user;
        this.setProfilePhoto();
        this.loading = false;
        this.profileService.loadSubject.next(ProfileState.Load)
      } else {
        this.getUser();
      }
    } else {
      this.getUser();
    }
  }

  setProfilePhoto() {
    this.user.image = this.user.image ? this.user.image : this.user.fullName ? `https://ui-avatars.com/api/?name=${this.user.fullName}` : this.user.userName ? `https://ui-avatars.com/api/?name=${this.user.userName}` : `https://ui-avatars.com/api/?name=${this.user.email}`;
  }

  getUser() {    
    this.hackerService.getHacker().subscribe(
			result => {
        this.user = result;
        const user = JSON.stringify(result);
        const encodedData = this.encodeService.encode(user);
        localStorage.setItem(environment.me, encodedData);
        this.setProfilePhoto();
        this.loading = false;
        this.profileService.loadSubject.next(ProfileState.Update)
			}
		)
  }
}
