import { Component, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { HackerService } from 'src/app/core/_services/hacker.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TestAndRequirementJson } from 'src/app/core/_models/TestAndRequirementJson';
import { PaymentStatus } from 'src/app/core/_enums/paymentStatus';
import { PaginationInstance } from 'ngx-pagination/dist/ngx-pagination.module';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent {
  searchInput!: string;
  sideNavOpened = false;

  sections = [
    { id: '', title: 'Dashboard', active: false },
    { id: '/projects', child: '/projects/details', title: 'Projects', active: false },
    { id: '/bounty-activity', child: '/bounty-activity/details', title: 'Bounty Activity', active: false },
    { id: '/payments', child: '/payments/details', title: 'Payments', active: false },
  ];

  user: any;
  authUser: any;
  userName: any;
  loading: boolean = true;
  loadingBounties: boolean = true;
  loadingProjects: boolean = true;
  bounties: any;
  projects: any;
  projectsQuery: any = '';
  projectsLevelQuery: any = '';
  projectsTestTypeQuery: any = '';
  testTypes?: TestAndRequirementJson[];
  requirementLevels?: TestAndRequirementJson[];
  totalCount:number = 0;
  pageSize:number = 8;
  page:number = 1;
  PaymentStatus = PaymentStatus;
  config = {
    id: 'custom',
    itemsPerPage: 8,
    currentPage: 1
  };

  constructor(
    @Inject(DOCUMENT) public document: Document,
    public hackerService: HackerService,
    public oidcSecurityService: OidcSecurityService,
    private _router: Router,
    private route: ActivatedRoute
  ) {

  }

  async ngOnInit(): Promise<void> {
    this.loading = true;
		this.getProjects();
    this.getTestTypes();
    this.getRequirementLevels();
	}

  getProjects() {
    this.loadingProjects = true;

    this.hackerService.getProjects().subscribe(
      result => {
        this.projects = result.data;
        this.totalCount = result.data.totalCount;
        this.loadingProjects = false;
      }
    )
  }

  getTestTypes() {
    this.hackerService.getTestingTypes().subscribe({
      next: (data: TestAndRequirementJson[]) => this.testTypes = data,
      error: (err) => console.error(err),
      complete: () => "the testtypes have been retreived successfully"
    })
  }

  getRequirementLevels() {
    this.hackerService.getRequirementLevels().subscribe({
      next: (data: TestAndRequirementJson[]) => this.requirementLevels = data,
      error: (err) => console.error(err),
      complete: () => "the requirement levels have been retreived successfully"
    })
  }

  toggleSideNav() {
    this.sideNavOpened = !this.sideNavOpened;
  }

  logout() {
    this.oidcSecurityService.logoff();
  }

  gotoProjectDetails(project: any) {
    this._router.navigate([project.id], { relativeTo: this.route });
  }

  resetFilters() {
    this.projectsQuery = '';
    this.projectsLevelQuery = '';
    this.projectsTestTypeQuery = '';
  }
}