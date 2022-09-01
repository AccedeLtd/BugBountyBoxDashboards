import { Component, EventEmitter, Inject, NgZone, Output } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AddFundsDialogComponent } from 'src/app/customer/settings/add-funds-dialog/add-funds-dialog.component';
import { CustomerService } from 'src/app/core/_services/customer.service';
import { DialogActions } from 'src/app/core/_enums/dialoagActions';
import { environment } from 'src/environments/environment';
import { EncodeService } from 'src/app/core/_services/encode.service';
import { ConfigService } from 'src/app/core/_services/config.service';
import { constants } from 'src/app/core/_utils/const';
import { ProfileService } from 'src/app/core/_services/profile.service';
import { ProfileState } from 'src/app/core/_enums/profileState';

@Component({
  selector: 'app-customer-nav',
  templateUrl: './customer-nav.component.html',
  styleUrls: ['./customer-nav.component.css']
})
export class CustomerNavComponent {
  searchInput!: string;
  sideNavOpened = false;
  private _mql!: MediaQueryList;
  sections = [
    { id: '', child: null, title: 'Dashboard', active: false, submenus: null, },
    { 
      id: '/payments',
      child: [
        '/payments',
        '/payments/transfers',
        '/payments/accounting'
      ],
      title: 'Payments',
      active: false,
      submenus: [
        { id: '/payments', onSelect: null, title: 'Payments', active: false },
        { id: null, onSelect: () => this.showAddFundsDialog(), title: 'Add funds', active: false },
        { id: '/payments/transfers', onSelect: null, title: 'Transfers', active: false },
        { id: '/payments/accounting', onSelect: null, title: 'Accounting', active: false },
      ]
    },
    { 
      id: '/projects',
      child: [
        '/new-project',
        '/projects',
        // '/incoming'
      ],
      title: 'Projects',
      active: false,
      submenus: [
        { id: '/new-project', onSelect: null, title: 'Create New Project', active: false },
        { id: '/projects', onSelect: null, title: 'Existing Projects', active: false },
        // { id: '/incoming', onSelect: null, title: 'Incoming Projects', active: false },
      ]
    },
    { id: '/incoming', child: null, title: 'Vulnerabilities', active: false, submenus: null, },
    { id: '/hackers', child: ['/hackers/details'], title: 'Hackers', active: false, submenus: null, },
  ];
  user: any;
  authUser: any;
  userName: any;
  loading: boolean = true;
  @Output() sideNavToggleEvent = new EventEmitter<boolean>();
  @Output() loadWalletBalanceEvent = new EventEmitter<any>();

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private _ngZone: NgZone,
    @Inject(DOCUMENT) public document: Document,
    public oidcSecurityService: OidcSecurityService,
    public router: Router,
    public customerService: CustomerService,
    public dialog: MatDialog,
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
      const route = this.router.url.replace('/customer', '');

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
    this.oidcSecurityService.logoff(constants.CUSTOMER);
    this.configService.clear();
  }

  getUser() {    
    this.customerService.getCustomer().subscribe(
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
      const authUser = this.oidcSecurityService.getUserData('customer');
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
    this.user.logoUrl = this.user.logoUrl ? this.user.logoUrl : this.user.businessName ? `https://ui-avatars.com/api/?name=${this.user.businessName}` : this.user.email ? `https://ui-avatars.com/api/?name=${this.user.email}` : `https://ui-avatars.com/api/?name=${this.user.userName}`;
  }

  selectOption(option: any) {
    if (option.id) {
      this.router.navigateByUrl(`/customer${option.id}`)
    }
    else {
      option.onSelect();
    }
  }

  showAddFundsDialog() {
    const dialogRef = this.dialog.open(AddFundsDialogComponent, {
      height: '700px',
      width: '600px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result.event == DialogActions.Update){
        this.loadWalletBalanceEvent.emit();
      }
    });
  }
}
