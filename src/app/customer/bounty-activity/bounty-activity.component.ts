import { Component, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { HackerService } from 'src/app/core/_services/hacker.service';
import { CustomerService } from 'src/app/core/_services/customer.service';
import { MatDialog } from '@angular/material/dialog';
import { PayoutsDialogComponent } from '../settings/payouts-dialog/payouts-dialog.component';
import * as _ from 'lodash';
import { DialogActions } from 'src/app/core/_enums/dialoagActions';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];

@Component({
  selector: 'app-bounty-activity',
  templateUrl: './bounty-activity.component.html',
  styleUrls: ['./bounty-activity.component.css']
})
export class BountyActivityComponent {
  searchInput!: string;
  sideNavOpened = false;
  user: any;
  authUser: any;
  userName: any;
  loading: boolean = true;
  loadingBugs: boolean = true;
  loadingVulnerabilities: boolean = true;
  bugs: any;

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;
  vulnerabilities: any;
  openVulnerabilities: any[] = [];
  validatedVulnerabilities: any[] = [];
  closedVulnerabilities: any[] = [];
  filteredString: string = '';
  validatedBugsConfig = {
    itemsPerPage: 5,
    currentPage: 1,
    totalItems: 0
  };
  openBugsConfig = {
    itemsPerPage: 5,
    currentPage: 1,
    totalItems: 0
  };
  closedBugsConfig = {
    itemsPerPage: 5,
    currentPage: 1,
    totalItems: 0
  }

  // vulnerabilities = [
  //   {
  //     "reportedBy": "Roy Korfmann",
  //     "type": "Cross site scripting",
  //     "date": "1/02/22",
  //     "assignedTo": "Kazzo",
  //     "assets": "Ibm.com",
  //     "amount": 72320
  //   },
  //   {
  //     "reportedBy": "Pierce Foan",
  //     "type": "SQL injection",
  //     "date": "1/02/22",
  //     "assignedTo": "Kazzo",
  //     "assets": "Ibm.com",
  //     "amount": 55070
  //   },
  //   {
  //     "reportedBy": "Jacklin Osgerby",
  //     "type": "Viruses",
  //     "date": "1/02/22",
  //     "assignedTo": "Kazzo",
  //     "assets": "Ibm.com",
  //     "amount": 99660
  //   },
  //   {
  //     "reportedBy": "Noak Pickburn",
  //     "type": "Trojan",
  //     "date": "1/02/22",
  //     "assignedTo": "Kazzo",
  //     "assets": "Ibm.com",
  //     "amount": 90520
  //   },
  //   {
  //     "reportedBy": "Zia Rew",
  //     "type": "Ransomeware",
  //     "date": "1/02/22",
  //     "assignedTo": "Kazzo",
  //     "assets": "Ibm.com",
  //     "amount": 76220
  //   },
  //   {
  //     "reportedBy": "Franciska Lawlie",
  //     "type": "Cross site scripting",
  //     "date": "1/02/22",
  //     "assignedTo": "Kazzo",
  //     "assets": "Ibm.com",
  //     "amount": 98070
  //   },
  //   {
  //     "reportedBy": "Emma McAless",
  //     "type": "Ransomeware",
  //     "date": "1/02/22",
  //     "assignedTo": "Kazzo",
  //     "assets": "Ibm.com",
  //     "amount": 89370
  //   },
  //   {
  //     "reportedBy": "Bret Barthrop",
  //     "type": "Ransomeware",
  //     "date": "1/02/22",
  //     "assignedTo": "Kazzo",
  //     "assets": "tva.com",
  //     "amount": 93350
  //   }
  // ]

  constructor(
    @Inject(DOCUMENT) public document: Document,
    public hackerService: HackerService,
    public oidcSecurityService: OidcSecurityService,
    public customerService: CustomerService,
    public dialog: MatDialog,
  ) {

  }

  async ngOnInit(): Promise<void> {
    this.loading = true;
		this.loadVulnerabilities();
	}
  
  loadVulnerabilities() {
    this.loadingVulnerabilities = true;

    this.customerService.getVulnerabilities().subscribe(
      result => {
    //    console.log(result);
        this.vulnerabilities = result.data;
        const vulnerabilitiesByStatus = _.groupBy(result.data, data => data.status);
        this.openVulnerabilities = vulnerabilitiesByStatus["0"] || [];
        this.openBugsConfig.totalItems = this.openVulnerabilities.length
        this.validatedVulnerabilities = vulnerabilitiesByStatus["1"] || [];
        this.validatedBugsConfig.totalItems = this.validatedVulnerabilities.length
        this.closedVulnerabilities = vulnerabilitiesByStatus["2"] || [];
        this.closedBugsConfig.totalItems = this.closedVulnerabilities.length
        this.loadingVulnerabilities = false;
      }
    )
  }

  toggleSideNav() {
    this.sideNavOpened = !this.sideNavOpened;
  }

  logout() {
    this.oidcSecurityService.logoff();
  }

  payout(vulnerability: any) {
    const dialogRef = this.dialog.open(PayoutsDialogComponent, {
      data: vulnerability,
      height: '500px',
      width: '600px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result.event == DialogActions.Update){
        this.loadVulnerabilities();
      }
    });
  }
}