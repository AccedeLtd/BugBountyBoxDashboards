import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { HackerService } from 'src/app/core/_services/hacker.service';
import LoadStatus from 'src/app/core/_utils/LoadStatus';
import { ToolbarService, LinkService, ImageService, HtmlEditorService } from '@syncfusion/ej2-angular-richtexteditor';

@Component({
  selector: 'app-bug-report-detail',
  templateUrl: './bug-report-detail.component.html',
  styleUrls: ['./bug-report-detail.component.css'],
  providers: [ToolbarService, LinkService, ImageService, HtmlEditorService]
})
export class BugReportDetailComponent implements OnInit {
  loadStatus: LoadStatus = 'loading';
  sideNavOpened = false;
  bugId: any;
  bug: any;
  tools: object = {
    enable: false, //for render only
  };

  constructor(
    public oidcSecurityService: OidcSecurityService,
    private _route: ActivatedRoute,
    public hackerService: HackerService,
  ) {
    this._route.params.subscribe((params) => {
      this.bugId = params["id"];
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.getSpecificBug();
  }

  getSpecificBug() {
    this.loadStatus = 'loading';
    this.hackerService.getBug(this.bugId).subscribe({
      next: result => {
        this.bug = result;
        //    console.log(this.specificBug);
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

}
