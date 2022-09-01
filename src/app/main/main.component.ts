import { Component, OnInit,} from '@angular/core';
import { Router } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { environment } from 'src/environments/environment';
import { AdminService } from '../core/_services/admin.services';
import { CustomerService } from '../core/_services/customer.service';
import { HackerService } from '../core/_services/hacker.service';
import { EncodeService } from '../core/_services/encode.service';
import { constants } from '../core/_utils/const';
import { ConfigService } from '../core/_services/config.service';
import { includeAdmin, includeHacker, includeCustomer } from 'src/app/config';

@Component({
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit {
  sideNavOpened = false;
  loading: boolean = true;
  isAuthenticated: boolean | undefined;
  user: any;
  readonly includeAdmin = includeAdmin;
  readonly includeCustomer = includeCustomer;
  readonly includeHacker = includeHacker;

  constructor(
    public _router: Router,
    public oidcSecurityService: OidcSecurityService,
    public hackerService: HackerService,
    public adminService: AdminService,
    public customerService: CustomerService,
    public encodeService: EncodeService,
    public configService: ConfigService,
  ) {

  }

  ngOnInit(): void {
    if(includeAdmin) {
      this.oidcSecurityService.checkAuth('', 'admin').subscribe(({ isAuthenticated, userData }) => {
        if (isAuthenticated) {
          this.handleAuth('admin', userData);
        }
        else {
          this.oidcSecurityService.authorize('admin');
        }
      });
    }
    else if(includeHacker) {
      this.oidcSecurityService.checkAuth('', 'hacker').subscribe(({ isAuthenticated, userData }) => {
        if (isAuthenticated) {
          this.handleHackerAuth('hacker', userData);
        }
        else {
          this.oidcSecurityService.authorize('hacker');
        }
      });
    }
    else if(includeCustomer) {
      this.oidcSecurityService.checkAuth('', 'customer').subscribe(({ isAuthenticated, userData }) => {
        if (isAuthenticated) {
          this.handleAuth('customer', userData);
        }
        else {
          this.oidcSecurityService.authorize('customer');
        }
      });
    }
    else {
      this.loading = true;
      let configId = '';
      const hashedConfigId = sessionStorage.getItem(constants.CONFIGID);
      if (hashedConfigId) configId = this.encodeService.decode(hashedConfigId);

      if (configId) {
        this.oidcSecurityService.checkAuth('', configId).subscribe(({ isAuthenticated, userData }) => {
          if (isAuthenticated) {
            if (userData.role != configId) {
              alert(
                `ACCESS DENIED. You are logged in as a ${userData.role} but trying to access the ${configId} dashboard. You will be redirected to the ${userData.role} dashboard.`
              );

              // this.oidcSecurityService.logoff(configId);

              switch (userData.role) {
                case "hacker":
                  this.getHacker();
                  return;
                case "admin":
                  this._router.navigateByUrl('admin');
                  return;
                case "customer":
                  this._router.navigateByUrl('customer');
                  return;
                case "developer":
                  this.oidcSecurityService.logoff();
                  return;
              }
            }
            else {
              switch (userData.role) {
                case "hacker":
                  this.getHacker();
                  return;
                case "admin":
                  this._router.navigateByUrl('admin');
                  return;
                case "customer":
                  this._router.navigateByUrl('customer');
                  return;
                case "developer":
                  this.oidcSecurityService.logoff();
                  return;
              }
            }
          }

          this.loading = false;
        });
      }
      else {
        this.loading = false;
      }
    }
  }

  handleAuth(role: string, userData: any) {
    if (userData.role != role) {
      alert(
        `ACCESS DENIED. Please login.`
      );
      this.oidcSecurityService.logoff(role);
    }
    else
      this._router.navigateByUrl(role);
  }

  handleHackerAuth(role: string, userData: any) {
    if (userData.role != 'hacker') {
      alert(
        `ACCESS DENIED. Please login.`
      );
      this.oidcSecurityService.logoff(role);
    }
    else
      this.getHacker();
  }

  toggleSideNav() {
    this.sideNavOpened = !this.sideNavOpened;
  }

  hackerLogin() {
    this.configService.setCurrentConfigId(constants.HACKER);
    this.oidcSecurityService.authorize('hacker');
  }
  
  adminLogin() {
    this.configService.setCurrentConfigId(constants.ADMIN);
    this.oidcSecurityService.authorize('admin');
  }
  
  customerLogin() {
    this.configService.setCurrentConfigId(constants.CUSTOMER);
    this.oidcSecurityService.authorize('customer');
  }

  getHacker() {    
    this.hackerService.getHacker().subscribe(
			result => {
        this.user = result;
        const user = JSON.stringify(result);
        const encodedData = this.encodeService.encode(user);
        sessionStorage.setItem(environment.me, encodedData);
        this._router.navigateByUrl('hacker');
			}
		)
  }

  getAdmin() {
    this.adminService.getAuthAdmin().subscribe(
			result => {
        this.user = result;
        const user = JSON.stringify(result);
        const encodedData = this.encodeService.encode(user);
        sessionStorage.setItem(environment.me, encodedData);
        this._router.navigateByUrl('admin');
			}
		)
  }

  getCustomer() {    
    this.customerService.getCustomer().subscribe(
			result => {
        this.user = result;
        const user = JSON.stringify(result);
        const encodedData = this.encodeService.encode(user);
        sessionStorage.setItem(environment.me, encodedData);
        this._router.navigateByUrl('customer');
			}
		)
  }

  authorize() {
    this.oidcSecurityService.authorize();
  }
  
  logout() {
    this.oidcSecurityService.logoff();
  }
}
