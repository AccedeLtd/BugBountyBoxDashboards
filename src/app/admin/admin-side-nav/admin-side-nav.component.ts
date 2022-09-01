import { Component, OnInit } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';

@Component({
  selector: 'app-admin-side-nav',
  templateUrl: './admin-side-nav.component.html',
  styleUrls: ['./admin-side-nav.component.css']
})
export class AdminSideNavComponent implements OnInit {
  items = [
    {
      text: 'Dashboard',
      routerLink: '/admin',
      exactPath: true,
    },
    {
      text: 'Payments',
      routerLink: '/admin/payments',
    },
    {
      text: 'Bounties',
      routerLink: '/admin/bounties',
    },
    {
      text: 'Clients',
      routerLink: '/admin/clients',
    },
    {
      text: 'Vulnerabilities',
      routerLink: '/admin/vulnerabilities',
    },
    {
      text: 'Bugs',
      routerLink: '/admin/bugs',
    },
    {
      text: 'Projects',
      routerLink: '/admin/projects',
    },
    {
      text: 'Hackers',
      routerLink: '/admin/hackers',
    },
    {
      text: 'Settings',
      routerLink: '/admin/settings',
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
