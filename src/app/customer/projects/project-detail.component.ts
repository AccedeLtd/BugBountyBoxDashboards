import { Component, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { HackerService } from 'src/app/core/_services/hacker.service';
import { MatDialog } from '@angular/material/dialog';
import { ProjectReviewDialogComponent } from './project-review-dialog/project-review-dialog.component';
import { RatingDialogComponent } from './rating-dialog/rating-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ListCustomerProjectJson } from 'src/app/core/_models/listCustomerProjectJson';
import { CloseProjectJson } from 'src/app/core/_models/closeProjectJson';
import { CustomerService } from 'src/app/core/_services/customer.service';
import { NotificationService } from 'src/app/core/_services/notification.service';
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
  showReportForm: boolean = false;
  user: any;
  authUser: any;
  userName: any;
  loading: boolean = true;
  ratingkey = '3Brating';
  rated!: boolean;
  rating!: string;
  recordName: number = 0;
  projectDetail?: ListCustomerProjectJson;
  closedProject?: CloseProjectJson;
  tools: object = {
    enable: false, //for render only
  };

  constructor(
    @Inject(DOCUMENT) public document: Document,
    public oidcSecurityService: OidcSecurityService,
    public hackerService: HackerService,
    public customerService: CustomerService,
    public dialog: MatDialog,
    private notifyService: NotificationService,
    private _route: ActivatedRoute,
    private router: Router
  ) {

  }

  async ngOnInit(): Promise<void> {
    // this.getRating();
    this.loading = true;
    this._route.params.subscribe((params) => {
      this.recordName = params["id"];
      //load record data
    });
    this.getProject(this.recordName);
  }

  getProject(id: number) {
    this.customerService.getCustomerProject(id).subscribe(
      result => {
        this.projectDetail = result;
    //    console.log(JSON.stringify(this.projectDetail));
        this.loading = !this.loading
      }
    )
  }

  getRating() {
    const rating = localStorage.getItem(this.ratingkey);
    if (rating == null) {
      this.rated = false;
    }
    else {
      this.rating = rating;
      this.rated = true;
    }
  }

  getUser() {
    this.hackerService.getHacker().subscribe(
      result => {
        this.user = result;

        if (result)
          this.userName = result.userName;
        else
          this.userName = this.authUser.userName;

        this.loading = false;
      }
    )
  }

  showToasterSuccess(message: string) {
    this.notifyService.showSuccess(message, "Congratulations")
  }

  showToasterError(message: string) {
    this.notifyService.showError(message, "Sorry")
  }

  closeProjectByCustomer(info: CloseProjectJson) {
    info.projectId = this.recordName;
    info.closedBy = this.projectDetail?.customer?.userName;

    this.customerService.closeProject(info.projectId).subscribe({
      next: result => {
        this.loading = false;
        this.showToasterSuccess("Your project has been closed successfully");
        setTimeout(() => {
          this.router.navigateByUrl('/customer/projects');
        }, 2000);
      },
      error: () => {
        this.loading = false;
        this.showToasterError("Your project could not be closed successfully");
      }
    })
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

  openDialog() {
    this.dialog.open(ProjectReviewDialogComponent, {
      // height: '400px',
      width: '400px',
    });
  }

  showRatingDialog() {
    this.dialog.open(RatingDialogComponent, {
      height: '500px',
      width: '400px',
    });
  }
}