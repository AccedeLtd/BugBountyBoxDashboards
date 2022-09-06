import { Component, OnInit } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';

@Component({
  selector: 'app-customer-side-nav',
  templateUrl: './customer-side-nav.component.html',
  styleUrls: ['./customer-side-nav.component.css']
})
export class CustomerSideNavComponent implements OnInit {
  items = [
    {
      text: 'Dashboard',
      routerLink: '/customer',
      exactPath: true,
    },
    {
      text: 'Payments',
      routerLink: '/customer/payments',
    },
    {
      text: 'Bounties',
      routerLink: '/customer/bounties',
    },
    {
      text: 'Clients',
      routerLink: '/customer/clients',
    },
    {
      text: 'Vulnerabilities',
      routerLink: '/customer/vulnerabilities',
    },
    {
      text: 'Bugs',
      routerLink: '/customer/bugs',
    },
    {
      text: 'Projects',
      routerLink: '/customer/projects',
    },
    {
      text: 'Hackers',
      routerLink: '/customer/hackers',
    },
    {
      text: 'Settings',
      routerLink: '/customer/settings',
    },
  ];

  constructor(
    public oidcSecurityService: OidcSecurityService,
  ) { }

  ngOnInit(): void {
  }

  logout() {
    this.oidcSecurityService.logoff();
  }

}
