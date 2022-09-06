import { Component, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { HackerService } from 'src/app/core/_services/hacker.service';
import { MatDialog } from '@angular/material/dialog';
import * as _ from 'lodash';
import { UpcomingPaymentsJSON } from 'src/app/core/_models/upcomingPaymentsJSON';

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
  selector: 'app-bugs-reports',
  templateUrl: './bugs-reports.component.html',
  styleUrls: ['./bugs-reports.component.css']
})
export class BugsReportsComponent {
  searchInput!: string;
  sideNavOpened = false;
  user: any;
  authUser: any;
  userName: any;
  loadingVulnerabilities: boolean = true;
  bugs: any;
  config = { 
    id: 'custom',
    itemsPerPage: 5,
    currentPage: 1,
  }

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;
  vulnerabilities: any;
  openVulnerabilities: any[] = [];
  validatedVulnerabilities: any[] = [];
  closedVulnerabilities: any[] = [];
  upcoming:UpcomingPaymentsJSON[] = [];
  filteredString:string = ''; 

  constructor(
    @Inject(DOCUMENT) public document: Document,
    public hackerService: HackerService,
    public oidcSecurityService: OidcSecurityService,
    public dialog: MatDialog,
  ) {

  }

  async ngOnInit(): Promise<void> {
    this.loadData();
	}

  loadData() {
    this.loadVulnerabilities();
  }
  
  loadVulnerabilities() {
    this.loadingVulnerabilities = true;

    this.hackerService.getHackerBountyActivity().subscribe(
      results => {
        //    console.log(results);
        this.vulnerabilities = results.data;
        this.loadingVulnerabilities = false;   
        //    console.log(see); 
        //    console.log(this.oTotalCount,this.cTotalCount,this.vTotalCount);
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