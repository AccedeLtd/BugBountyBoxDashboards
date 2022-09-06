import { Component, EventEmitter, Inject, NgZone, Output } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/core/_services/admin.services';
import { environment } from 'src/environments/environment';
import { EncodeService } from 'src/app/core/_services/encode.service';
import { constants } from 'src/app/core/_utils/const';
import { ConfigService } from 'src/app/core/_services/config.service';
import { ProfileService } from 'src/app/core/_services/profile.service';
import { ProfileState } from 'src/app/core/_enums/profileState';

@Component({
  selector: 'app-admin-nav',
  templateUrl: './admin-nav.component.html',
  styleUrls: ['./admin-nav.component.css']
})
export class AdminNavComponent {
  searchInput!: string;
  sideNavOpened = false;
  private _mql!: MediaQueryList;
  sections = [
    { id: '', title: 'Dashboard', child: null, submenus: null, active: false },
    // { id: '/payments', child: ['/payments/details'], title: 'Payments', submenus: null, active: false },
    { 
      id: '/payments',
      child: [
        '/bounties',
        '/payments/details',
        '/payments/accounting',
      ],
      title: 'Payments',
      active: false,
      submenus: [
        { id: '/payments', onSelect: null, title: 'All Payments', active: false },
        { id: '/bounties', onSelect: null, title: 'Bounties', active: false },
        { id: '/payments/accounting', onSelect: null, title: 'Accounting', active: false },
      ]
    },
    // { id: '/bounties', title: 'Bounties', child: null, submenus: null, active: false },
    { id: '/clients', title: 'Clients', child: null, submenus: null, active: false },
    { 
      id: '/projects',
      child: [
        '/projects/details',
        '/vulnerabilities',
        '/vulnerability-types',
      ],
      title: 'Projects',
      active: false,
      submenus: [
        { id: '/projects', onSelect: null, title: 'All projects', active: false },
        { id: '/vulnerabilities', onSelect: null, title: 'Vulnerabilities', active: false },
        { id: '/vulnerability-types', onSelect: null, title: 'Vulnerability Type', active: false },
        // { id: '/vulnerabilities', onSelect: null, title: 'Asset Types', active: false },
        // { id: '/vulnerabilities', onSelect: null, title: 'Test Types', active: false },
        // { id: '/vulnerabilities', onSelect: null, title: 'Requirement Levels', active: false },
      ]
    },
    { id: '/bugs', child: ['/bugs/details'], title: 'Bugs', submenus: null, active: false },
    // { id: '/projects', child: ['/projects/details'], title: 'Projects', submenus: null, active: false },
    { id: '/hackers', child: ['/bounty-activity/details'], title: 'Hackers', submenus: null, active: false },
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
    public adminService: AdminService,
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
      const route = this.router.url.replace('/admin', '');

      s.active = route == s.id;
      
      if (route !== s.id && s.child) {
        const active = s.child.find(r => r == route);
        if(active)
          s.active = true;
      }
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
    this.oidcSecurityService.logoff(constants.ADMIN);
    this.configService.clear();
  }

  getUser() {
    this.loading = true;

    this.adminService.getAuthAdmin().subscribe(
			result => {
        this.user = result;
        const user = JSON.stringify(result);
        const encodedData = this.encodeService.encode(user);
        sessionStorage.setItem(environment.me, encodedData);
        this.setProfilePhoto();
        this.loading = false;
			}
		)
  }

  checkUserProfile() {
    let decodedData = null;
    const me = sessionStorage.getItem(environment.me);
    if(me) decodedData = this.encodeService.decode(me);

    if(decodedData) {
      const user = JSON.parse(decodedData);
      const authUser = this.oidcSecurityService.getUserData('admin');
      if(user.email == authUser.email || user.userName == authUser.preferred_username) {
        this.user = user;
        this.setProfilePhoto();
        this.loading = false;
      } else {
        this.getUser();
      }
    } else {
      this.getUser();
    }
  }

  setProfilePhoto() {
    this.user.profilePhotoUrl = this.user.profilePhotoUrl ? this.user.profilePhotoUrl : this.user.fullName ? `https://ui-avatars.com/api/?name=${this.user.firstName}` : this.user.userName ? `https://ui-avatars.com/api/?name=${this.user.userName}` : `https://ui-avatars.com/api/?name=${this.user.email}`;
  }

  async selectOption(option: any) {
    if (option.id) {
      this.router.navigateByUrl(`/admin${option.id}`)
    }
    else {
      option.onSelect();
    }
  }
}
