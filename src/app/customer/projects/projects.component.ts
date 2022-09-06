import { Component, Inject, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { DOCUMENT } from '@angular/common';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { HackerService } from 'src/app/core/_services/hacker.service';
import { ProjectsService } from 'src/app/core/_services/projects.service';
import { CustomerService } from 'src/app/core/_services/customer.service';
import { ListCustomerProjectJson, RequirementLevel } from 'src/app/core/_models/listCustomerProjectJson';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  searchInput!: string;
  sideNavOpened = false;
  totalCount:number = 0;
  pageSize:number = 5;
  page:number = 1;
  user: any;
  authUser: any;
  userName: any;
  loading: boolean = true;
  loadingBounties: boolean = true;
  bounties: any;
  customerProjectsList:ListCustomerProjectJson[] = [];
  filteredstring:string = '';
  testTypes:RequirementLevel[] = [];
  reqLevels:RequirementLevel[] = [];
  requirementLevel?:number;
  thetestType?:number;
  projStatus?:number;

  constructor(
    @Inject(DOCUMENT) public document: Document,
    public hackerService: HackerService,
    public oidcSecurityService: OidcSecurityService,
    private customerService:CustomerService
  ) {

  }

  async ngOnInit(): Promise<void> {
    this.getProjectsByCustomer();
    this.getTestTypes();
    this.getRequirementLevels();
	}
    
  getProjectsByCustomer(){
    this.loading = true;
    this.customerService.getCustomerProjects().subscribe(
      results => {
    //    console.log(`${JSON.stringify(results)}`);
        this.customerProjectsList = results.result.data;
        this.totalCount = results.result.totalCount;
    //    console.log(this.totalCount);
        this.loading = false; 
    //    console.log(JSON.stringify(this.customerProjectsList));
      }
    )
  }

  getProjectsFilterByCustomer(projectStat?:number, testType?:number, requirementLevel?:number){
    this.loading = true;
    this.customerService.getCustomerProjects(projectStat, testType, requirementLevel).subscribe(
      results => {
        this.customerProjectsList = results.result.data;  
        this.totalCount = results.result.totalCount;
    //    console.log(this.totalCount); 
        this.loading = false; 
    //    console.log(JSON.stringify(this.customerProjectsList));
      }
    )
  }

  getTestTypes(){
    this.customerService.getAllTestTypes().subscribe(
      results => {
        this.testTypes = results.result.data;
    //    console.log(`${JSON.stringify(this.testTypes)}`);
      }
    )
  }

  getRequirementLevels(){
    this.customerService.getAllRequirementLevels().subscribe(
      results => {
        this.reqLevels = results.result.data;
    //    console.log(`${JSON.stringify(this.reqLevels)}`);
      }
    )
  }

  toggleSideNav() {
    this.sideNavOpened = !this.sideNavOpened;
  }

  logout() {
    this.oidcSecurityService.logoff();
  }

  resetFilter() {
    this.projStatus = undefined;
    this.thetestType = undefined;
    this.requirementLevel = undefined;
    this.getProjectsFilterByCustomer(this.projStatus, this.thetestType, this.requirementLevel);
  }
  
}