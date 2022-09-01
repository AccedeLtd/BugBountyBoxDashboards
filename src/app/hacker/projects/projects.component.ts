import { Component, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { HackerService } from 'src/app/core/_services/hacker.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TestAndRequirementJson } from 'src/app/core/_models/TestAndRequirementJson';
import { PaymentStatus } from 'src/app/core/_enums/paymentStatus';
import { forkJoin } from 'rxjs';
import LoadStatus from 'src/app/core/_utils/LoadStatus';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent {
  loadStatus: LoadStatus = 'loading';
  searchInput!: string;
  sideNavOpened = false;
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
    this.loadData();
	}
  
  loadData() {
    forkJoin({
      userProfile: this.hackerService.getProfile(),
      testingTypes: this.hackerService.getTestingTypes(),
      requirementLevels: this.hackerService.getRequirementLevels(),
    }).subscribe({
      next: ({userProfile, testingTypes, requirementLevels}) => {
        this.testTypes = testingTypes;
        this.requirementLevels = requirementLevels;
        const level = this.requirementLevels?.find(i => i.name.includes(userProfile.level));
        this.getProjects(level!.id);
        // this.loadStatus = 'success';
      },
      error: () => {
        this.loadStatus = 'error';
      }
    })
  }

  getProjects(level: number) {
    this.hackerService.getProjects({
      requirementLevelId: level
    }).subscribe({
      next: (result) => {
        this.projects = result.data;
        this.totalCount = result.data.totalCount;
        this.loadStatus = 'success';
      },
      error: () => {
        this.loadStatus = 'error';
      }
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