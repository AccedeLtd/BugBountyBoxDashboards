import { Component, Inject, NgZone } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { DOCUMENT } from '@angular/common';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { HackerService } from 'src/app/core/_services/hacker.service';
import { merge, Observable, of } from 'rxjs';
import * as _ from 'lodash';
import { CustomerService } from 'src/app/core/_services/customer.service';
import { NotificationService } from 'src/app/core/_services/notification.service';

@Component({
  selector: 'app-transfers',
  templateUrl: './transfers.component.html',
  styleUrls: ['./transfers.component.css']
})
export class TransfersComponent {
  sideNavOpened = false;

  sections = [
    { id: '', title: 'Dashboard', active: false },
    { id: '/payments', child: '/payments/details', title: 'Payments', active: false },
    { id: '/bounties', title: 'Bounties', active: false },
    { id: '/clients', title: 'Clients', active: false },
    { id: '/vulnerabilities', title: 'Vulnerabilities', active: false },
    { id: '/bugs', child: '/bugsy/details', title: 'Bugs', active: false },
    { id: '/projects', child: '/projects/details', title: 'Projects', active: false },
    { id: '/hackers', child: '/bounty-activity/details', title: 'Hackers', active: false },
  ];
  
  user: any;
  authUser: any;
  userName: any;
  loading: boolean = true;
  loadingTransfers: boolean = true;
  totalCount:number = 0;
  pageSize:number = 8;
  page:number = 1;

  upcoming = [
    {
      "name": "Roy Korfmann",
      "amount": 7232
    },
    {
      "name": "Pierce Foan",
      "amount": 5507
    },
    {
      "name": "Jacklin Osgerby",
      "amount": 9966
    },
    {
      "name": "Noak Pickburn",
      "amount": 9052
    },
    {
      "name": "Zia Rew",
      "amount": 7622
    },
    {
      "name": "Franciska Lawlie",
      "amount": 9807
    },
    {
      "name": "Emma McAless",
      "amount": 8937
    },
    {
      "name": "Bret Barthrop",
      "amount": 9335
    }
  ]
  
  completed = [
    {
      "name": "Haywood Cartmill",
      "amount": 9411
    },
    {
      "name": "Clarine Willimont",
      "amount": 5705
    },
    {
      "name": "Cookie Youd",
      "amount": 8016
    },
    {
      "name": "Jeanie Kibbey",
      "amount": 9903
    },
    {
      "name": "Winnie Brickham",
      "amount": 6737
    },
    {
      "name": "Robenia Holttom",
      "amount": 5549
    },
    {
      "name": "Margarette Harfoot",
      "amount": 9836
    },
    {
      "name": "Joli Bomb",
      "amount": 7062
    }
  ]
  pastPayments: any[] = [];
  upcomingPayments: any[] = [];

  constructor(
    @Inject(DOCUMENT) public document: Document,
    public oidcSecurityService: OidcSecurityService,
    public customerService: CustomerService,
    public notifyService: NotificationService,
  ) {

  }

  async ngOnInit(): Promise<void> {
    this.loadTransfers();
	}

  loadTransfers() {
    this.loadingTransfers = true;
    this.customerService.getPayouts().subscribe({
      next: result => {
        const groupedByTransactionStatus = _.groupBy(result.data, data => data.status);

        const pendingTransactions = groupedByTransactionStatus['0'] || [];//ProjectStatus Enum
        const completedTransactions = groupedByTransactionStatus['1'] || [];//ProjectStatus Enum

        this.upcomingPayments = pendingTransactions;
        this.pastPayments = completedTransactions;

        this.totalCount = result.data.totalCount;
        this.loadingTransfers = false;
      },
      error: error => {
        this.notifyService.showError('Something went wrong, please try again', 'Error');
      }
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
