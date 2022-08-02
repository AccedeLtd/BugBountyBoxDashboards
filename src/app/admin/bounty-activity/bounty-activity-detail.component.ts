import { Component, Inject } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { DOCUMENT } from '@angular/common';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { HackerService } from 'src/app/core/_services/hacker.service';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from 'src/app/core/_services/admin.services';
import { BugReviewJsonList } from 'src/app/core/_models/BugReviewJsonList';
import { MatDialog } from '@angular/material/dialog';
import { ValidateProjectDialogComponent } from '../validate-project-dialog/validate-project-dialog.component';
import { ToolbarService, LinkService, ImageService, HtmlEditorService } from '@syncfusion/ej2-angular-richtexteditor';
import { BugStatus } from 'src/app/core/_enums/bugStatus';

@Component({
  selector: 'app-bounty-activity-detail',
  templateUrl: './bounty-activity-detail.component.html',
  styleUrls: ['./bounty-activity-detail.component.css'],
  providers: [ToolbarService, LinkService, ImageService, HtmlEditorService]
})
export class BountyActivityDetailComponent {
  searchInput!: string;
  sideNavOpened = false;

  sections = [
    { id: '', title: 'Dashboard', active: false },
    { id: '/projects', child: '/projects/details', title: 'Projects', active: false },
    { id: '/bounty-activity', child: '/bounty-activity/details', title: 'Bounty Activity', active: false },
    { id: '/payments', child: '/payments/details', title: 'Payments', active: false },
  ];
  
  showReportForm: boolean = false;
  user: any;
  authUser: any;
  userName: any;
  loading: boolean = true;
  recordName:number = 0;
  specificBug?:BugReviewJsonList;
  BugStatus = BugStatus;
  tools: object = {
    enable: false, //for render only
  };

  constructor(
    @Inject(DOCUMENT) public document: Document,
    public oidcSecurityService: OidcSecurityService,
    public hackerService: HackerService,
    private adminService:AdminService,
    private _route:ActivatedRoute,
    private dialog: MatDialog
  ) {

  }

  async ngOnInit(): Promise<void> {
    this.loading = true;
    this._route.params.subscribe((params) => {
      this.recordName = params["id"];
      //load record data
    });
    this.getSpecificBug();
	}

  getSpecificBug(){
    this.adminService.getSpecificBugFromAdmin(this.recordName).subscribe(
      results => {
        this.specificBug = results.result;
    //    console.log(this.specificBug);
      }
    )
  }

  validateDialog(){
    let dialogRef = this.dialog.open(ValidateProjectDialogComponent, {
      data:this.recordName,  
      height: '500px',
      width: '600px',
    });
    
  }

  toggleSideNav() {
    this.sideNavOpened = !this.sideNavOpened;
  }

  logout() {
    this.oidcSecurityService.logoff();
  }

  toggleReportForm() {
    this.showReportForm = !this.showReportForm;
  }
}