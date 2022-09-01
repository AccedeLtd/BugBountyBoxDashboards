import { Component, OnInit } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent implements OnInit {
  items = [
    {
      text: 'Dashboard',
      routerLink: '/hacker',
      exactPath: true,
    },
    {
      text: 'Projects',
      routerLink: '/hacker/projects',
    },
    {
      text: 'Tasks',
      routerLink: '/hacker/tasks',
    },
    {
      text: 'Bounty Activity',
      routerLink: '/hacker/bounty-activity',
    },
    {
      text: 'Reports',
      routerLink: '/hacker/bugs',
    },
    {
      text: 'Payments',
      routerLink: '/hacker/payments',
      children: [
        {
          text: 'Accounting',
          path: '/accounting',
        },
      ],
    },
    {
      text: 'Settings',
      routerLink: '/hacker/settings',
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
