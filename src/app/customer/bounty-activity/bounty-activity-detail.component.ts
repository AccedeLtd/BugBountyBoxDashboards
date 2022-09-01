import { Component, Inject } from '@angular/core';
import { concatMap, filter, map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { DOCUMENT } from '@angular/common';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { HackerService } from 'src/app/core/_services/hacker.service';
import { CustomerService } from 'src/app/core/_services/customer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { result } from 'lodash';
import { BugStatus } from 'src/app/core/_enums/bugStatus';
import { ToolbarService, LinkService, ImageService, HtmlEditorService } from '@syncfusion/ej2-angular-richtexteditor';
import { PayoutsDialogComponent } from '../settings/payouts-dialog/payouts-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogActions } from 'src/app/core/_enums/dialoagActions';

@Component({
  selector: 'app-bounty-activity-detail',
  templateUrl: './bounty-activity-detail.component.html',
  styleUrls: ['./bounty-activity-detail.component.css'],
  providers: [ToolbarService, LinkService, ImageService, HtmlEditorService]
})
export class BountyActivityDetailComponent {
  searchInput!: string;
  sideNavOpened = false;  
  showReportForm: boolean = false;
  user: any;
  authUser: any;
  userName: any;
  loading: boolean = true;
  bug: any;
  BugStatus = BugStatus;
  tools: object = {
    enable: false, //for render only
  };

  constructor(
    @Inject(DOCUMENT) public document: Document,
    public oidcSecurityService: OidcSecurityService,
    public customerService: CustomerService,
    public route: ActivatedRoute,
    public router: Router,
    public dialog: MatDialog,
  ) {

  }

  async ngOnInit(): Promise<void> {
    this.route.params.subscribe((params) => {
      const id = params["id"];
      this.getBug(id);
    }
    );
	}

  getBug(id: any) {
    this.customerService.getVulnerability(id).subscribe({
      next: result => {
        this.bug = result
      }
    })
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
        this.router.navigateByUrl('customer/incoming');
      }
    });
  }
}