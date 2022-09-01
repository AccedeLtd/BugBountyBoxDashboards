import { Component, Inject } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { DOCUMENT } from '@angular/common';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { HackerService } from 'src/app/core/_services/hacker.service';
import { MatDialog } from '@angular/material/dialog';
import { ProjectReviewDialogComponent } from './project-review-dialog/project-review-dialog.component';
import { AdminService } from 'src/app/core/_services/admin.services';
import { ListCustomerProjectJson, RequirementLevel } from 'src/app/core/_models/listCustomerProjectJson';
import { ActivatedRoute, Router } from '@angular/router';
import { AddReviewJson } from 'src/app/core/_models/addReviewJson';
import { NotificationService } from 'src/app/core/_services/notification.service';
import { BugReviewJsonList, BugReviews } from 'src/app/core/_models/BugReviewJsonList';
import { AddBugReviewJSON } from 'src/app/core/_models/addBugReviewJson';
import { AuthenticatedAdminJson } from 'src/app/core/_models/authAdminJson';
import { ToolbarService, LinkService, ImageService, HtmlEditorService } from '@syncfusion/ej2-angular-richtexteditor';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css'],
  providers: [ToolbarService, LinkService, ImageService, HtmlEditorService]
})
export class ProjectDetailComponent {
  searchInput!: string;
  sideNavOpened = false;
  detailedProject?:ListCustomerProjectJson;
  reviewLoading:boolean = false;
  activeReviewLoading:boolean = false;
  activeLoading:boolean = false;
  recordName:number = 0;
  bugreviewsByHacker:BugReviewJsonList[] =[];
  bugreview?:BugReviewJsonList;
  bugLoading:boolean = false;
  projectBugReviews:BugReviews[] = [];
  authAdmin?:AuthenticatedAdminJson;
  bugReportId:number = 0;  
  showReportForm: boolean = false;
  user: any;
  authUser: any;
  userName: any;
  loading: boolean = true;
  reviewComment:string = '';
  activeReviewComment:string = '';
  reviews?:AddReviewJson;
  bugreviews?:AddBugReviewJSON;
  domainsofProject?:RequirementLevel[];
  tools: object = {
    enable: false, //for render only
  };
  
  constructor(
    @Inject(DOCUMENT) public document: Document,
    public oidcSecurityService: OidcSecurityService,
    private adminService:AdminService, 
    public dialog: MatDialog,
    private _route:ActivatedRoute,
    private notifyService:NotificationService,
    private router:Router
  ) { 

  }

  showToasterSuccess(message:string){
    this.notifyService.showSuccess(message, "Congratulations")
  }
 
  showToasterError(message:string){
    this.notifyService.showError(message, "Sorry")
  }  

  async ngOnInit(): Promise<void> {
    this.loading = true;
    this._route.params.subscribe((params) => {
      this.recordName = params["id"];
      //load record data
 });
 this.getProjectById(this.recordName);
 this.reviewedProjectsBugsByAdmin(this.recordName);
 this.getAuthenticatedAdmin();
	}

  toggleSideNav() {
    this.sideNavOpened = !this.sideNavOpened;
  }

  getProjectById(id:number){
    this.adminService.getProjectById(id).subscribe(
      result => {
    //    console.log(JSON.stringify(result));
        this.detailedProject = result;
        this.domainsofProject = this.detailedProject?.domains;
        console.log(this.domainsofProject);     
        this.loading = false;
      }
    )
  }

  addReviewToProject(review:AddReviewJson){
    this.reviewLoading = true;
    review.projectId = this.recordName;
    review.comment = this.reviewComment;
    this.adminService.addReviewByAdmin(review).subscribe(
      result => {
    //    console.log(JSON.stringify(result));
        this.reviewLoading = false;
        this.detailedProject?.reviews.push({
          comment:review.comment,
          date:new Date(),
          userName:this.authAdmin?.userName
        });
        result.success === true ? this.showToasterSuccess("your review has been added successfully") : this.showToasterError("your review was not able to be added successfully");
      }
    )
  }

  getAuthenticatedAdmin(){
    this.adminService.getAuthAdmin().subscribe(
      results => {
        this.authAdmin = results.result;
    //    console.log(JSON.stringify(this.authAdmin));
      }
    )
  }
  
  addActiveReviewToProject(review:AddBugReviewJSON){
    this.activeReviewLoading = true;
    review.comment = this.activeReviewComment; 
    review.bugReportId = this.bugreview?.id;
    review.status = 1;
    this.adminService.addBugReviewByAdmin(review).subscribe(
      result => {
        this.activeReviewLoading = false;
    //    console.log(JSON.stringify(result));
    //    console.log(this.authAdmin?.id);
    //    console.log(this.authAdmin?.id);
    //    console.log(this.authAdmin?.id);
    //    console.log(review.comment);
        this.projectBugReviews.push({
          comment:review.comment,
          date:new Date(),
          bugReportId:this.bugreview?.id,
          adminId:this.authAdmin?.id,
          username:this.authAdmin?.userName
        });
        result.success === true ? this.showToasterSuccess("your review has been added successfully") : this.showToasterError("your review was not able to be added successfully");
      }
    )
  }

  markActiveByAdmin(){
    this.activeLoading = true;
    this.adminService.markProjectAsActive(this.recordName).subscribe(
      result => {
        this.activeLoading = false;
        setTimeout(() => {
          if(result.success){ 
            this.showToasterSuccess("Approval successful.");
            this.router.navigateByUrl('/admin/projects');
          }
          if(!result.success){ 
            this.showToasterError("Something went wrong. Please try again.");
            // this.router.navigateByUrl('/projects/details');
          }
          
        }, 2000);
      }
    )
  }

  reviewedProjectsBugsByAdmin(projectId:number){
    this.bugLoading  = !this.bugLoading;
    this.adminService.reviewProjectBugSubmissions(projectId).subscribe(
      results => {
        this.bugreviewsByHacker = results.result;
    //    console.log(JSON.stringify(this.bugreviewsByHacker));
        this.bugLoading = !this.bugLoading;
      }
    )
  }
  
  logout() {
    this.oidcSecurityService.logoff();
  }

  toggleReportForm(bugId:number) {
    this.showReportForm = !this.showReportForm;
    this.adminService.getBugDetail(bugId).subscribe(
      result => {
        this.bugreview = result;
        this.projectBugReviews = result.reviews;
      }
    )
  }

  openDialog() {
    this.dialog.open(ProjectReviewDialogComponent, {
      // height: '400px',
      width: '400px',
    });
  }
}