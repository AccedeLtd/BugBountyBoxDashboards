import { Component, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { HackerService } from 'src/app/core/_services/hacker.service';
import { AdminService } from 'src/app/core/_services/admin.services';
import { ListCustomerProjectJson } from 'src/app/core/_models/listCustomerProjectJson';
import { PaymentStatus } from 'src/app/core/_enums/paymentStatus';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent {
  searchInput!: string;
  sideNavOpened = false;
  filteredString:string = '';
  allProjects:ListCustomerProjectJson[] = [];
  filteredProjects?:ListCustomerProjectJson[];
  totalCount?:number;
  pageSize:number = 8;
  page:number = 1;

  projectsQuery: any = '';
  projectsLevelQuery: any = '';
  projectsTestTypeQuery: any = '';

  config = {
    id: 'custom',
    itemsPerPage: 8,
    currentPage: 1
  };

  user: any;
  authUser: any;
  userName: any;
  loading: boolean = true;
  bounties: any;
  testTypes: any;
  requirementLevels: any;
  PaymentStatus = PaymentStatus;

  constructor(
    @Inject(DOCUMENT) public document: Document,
    public hackerService: HackerService,
    public oidcSecurityService: OidcSecurityService,
    private adminService:AdminService
  ) {

  }

  async ngOnInit(): Promise<void> {
    this.getAllProjects();
    this.getTestTypes();
    this.getRequirementLevels();
	}

  getAllProjects(){
    this.loading = true;
    this.adminService.getProjects().subscribe(
      result => {
    //    console.log(JSON.stringify(result.data));
        this.loading = false;
        this.allProjects = result.data;
        this.allProjects = this.allProjects?.filter(e => e.projectStatus !== 0 && e.projectStatus !== 3);
        this.totalCount = this.allProjects?.length;
    //    console.log(this.totalCount);
        this.allProjects = this.allProjects?.filter(e => e.projectStatus !== 0);
      }
    )
  }

  getTestTypes() {
    this.adminService.getTestTypes().subscribe({
      next: (result: any) => this.testTypes = result.data,
      error: (err) => console.error(err),
    })
  }

  getRequirementLevels() {
    this.adminService.getRequirementLevels().subscribe({
      next: (result: any) => this.requirementLevels = result.data,
      error: (err) => console.error(err),
    })
  }

  toggleSideNav() {
    this.sideNavOpened = !this.sideNavOpened;
  }

  logout() {
    this.oidcSecurityService.logoff();
  }

  resetFilters() {
    this.projectsQuery = '';
    this.projectsLevelQuery = '';
    this.projectsTestTypeQuery = '';
  }
}