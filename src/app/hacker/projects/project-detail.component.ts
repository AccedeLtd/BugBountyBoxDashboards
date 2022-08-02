import { Component, Inject } from '@angular/core';
import { concatMap, filter, map } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { HackerService } from 'src/app/core/_services/hacker.service';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateBugReportInput } from 'src/app/core/_models/createBugReportInput';
import { BugStatus } from 'src/app/core/_enums/bugStatus';
import { VulnerabilitySeverity } from 'src/app/core/_enums/vulnerabilitySeverity';
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
  selectedAsset: any;
  project$: Observable<any> | undefined;
  proficiencyLevelMap: { [k: string]: string} = {
    "0": "Low",
    "1": "Medium",
    "2": "High",
    "3": "Critical",
  }
  severityClasses: { [k: string]: string} = {
    "0": "low",
    "1": "medium",
    "2": "high",
    "3": "critical",
  }
  proficiencyRatings: any[] = [];
  severity: number | undefined;
  vulnerabilities: any;
  selectedVulnerability: any;
  descriptionPreview: boolean = false;
  impactPreview: boolean = false;
  assetQuery: any = '';
  vulnerabilityQuery: any = '';
  assetTypes: any;
  value: string = `
  <h1 id="summary-"><strong>Summary:</strong></h1>
  <p> <span style="font-size: 18pt;">[add a summary of the vulnerability]</span></p>
  <p><br></p>
  <h1 id="steps-to-reproduce-"><strong>Steps To Reproduce:</strong></h1>
  <p> <span style="font-size: 18pt;">[add details for how we can reproduce the issue]</span></p>
  <p><span style="font-size: 18pt;"> 1. [add step]</span></p>
  <p><span style="font-size: 18pt;"> 2. [add step]</span></p>
  <p><span style="font-size: 18pt;"> 3. [add step]</span></p>
  <p><span style="font-size: 18pt;"><br></span></p>
  <h1 id="supporting-materials-references-"><strong>Supporting Materials/References:</strong></h1>
  <p> <span style="font-size: 18pt;">[list any additional material(e.g. screenshots, logs, etc.)]</span></p>
  <p><span style="font-size: 18pt;"> *[attachment/reference]</span></p>
  `;
  bugReport: CreateBugReportInput = {
    projectDomainId: 0,
    dateOfSubmission: '',
    title: '',
    description: `
    <h1 id="summary-"><strong>Summary:</strong></h1>
    <p> <span style="font-size: 18pt;">[add a summary of the vulnerability]</span></p>
    <p><br></p>
    <h1 id="steps-to-reproduce-"><strong>Steps To Reproduce:</strong></h1>
    <p> <span style="font-size: 18pt;">[add details for how we can reproduce the issue]</span></p>
    <p><span style="font-size: 18pt;"> 1. [add step]</span></p>
    <p><span style="font-size: 18pt;"> 2. [add step]</span></p>
    <p><span style="font-size: 18pt;"> 3. [add step]</span></p>
    <p><span style="font-size: 18pt;"><br></span></p>
    <h1 id="supporting-materials-references-"><strong>Supporting Materials/References:</strong></h1>
    <p> <span style="font-size: 18pt;">[list any additional material(e.g. screenshots, logs, etc.)]</span></p>
    <p><span style="font-size: 18pt;">*[attachment/reference]</span></p>
    `,
    impact: '',
    vulnerabilityId: 0,
    status: 0,
    severity: 0,
  };
  submitting: boolean = false;
  tools: object = {
    // enable: false, //for render only
    type: 'Expand',
    items: [
      'Bold',
      'Italic',
      'Underline',
      // 'FontSize',
      '|',
      'Formats',
      // 'Alignments',
      // 'OrderedList',
      // 'UnorderedList',
      // 'Outdent',
      // 'Indent',
      '|',
      'CreateLink',
      'Image',
      '|',
      // 'SourceCode',
      'Undo',
      'Redo'
    ]
  };
  placeholders = [
    '[add a summary of the vulnerability]',
    '[add details for how we can reproduce the issue]',
    '[add step]',
    '[list any additional material(e.g. screenshots, logs, etc.)]',
    '*[attachment/reference]',
  ];
  vulnerabilityTypes: any;
  insertImageSettings: object = {
    saveFormat: "Base64"
  }

  constructor(
    @Inject(DOCUMENT) public document: Document,
    public oidcSecurityService: OidcSecurityService,
    public hackerService: HackerService,
    public notifyService: NotificationService,
    private route: ActivatedRoute,
    private router: Router,
  ) {

  }

  async ngOnInit(): Promise<void> {
    this.getProject();
    this.getAssetTypes();
    this.getVulnerabilities();
    this.getVulnerabilityTypes();
  }

  getProject() {
    this.project$ = this.route.params.pipe(
      map(params => params["id"]),
      filter(id => !!id),
      concatMap(id => this.hackerService.getProject(id))
    );
  }

  getAssetTypes() {
    this.hackerService.getAssetTypes().subscribe(
      result => {
        this.assetTypes = result.data;
      }
    )
  }
  
  getVulnerabilities() {
    this.hackerService.getVulnerabilities().subscribe(
      result => {
        this.vulnerabilities = result.data;
      }
    )
  }
  
  getVulnerabilityTypes() {
    this.hackerService.getVulnerabilityTypes().subscribe(
      result => {
        this.vulnerabilityTypes = result.data;
      }
    )
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

  selectAssset(domain: any) {
    if(this.selectedAsset)
      this.selectedAsset.active = !this.selectedAsset.active;
    
    if (domain == this.selectedAsset) {
      this.selectedAsset.active ? this.selectedAsset = domain : this.selectedAsset = null;
    } else {
      domain.active = !domain.active;
      domain.active ? this.selectedAsset = domain : this.selectedAsset = null;
    }
  }

  deselectAsset(domain: any) {
    domain.active = false;
    this.selectedAsset = null;
  }
  
  selectVulnerability(vulnerability: any) {
    if(this.selectedVulnerability)
      this.selectedVulnerability.active = !this.selectedVulnerability.active;
    
    if (vulnerability == this.selectedVulnerability) {
      this.selectedVulnerability.active ? this.selectedVulnerability = vulnerability : this.selectedVulnerability = null;
    } else {
      vulnerability.active = !vulnerability.active;
      vulnerability.active ? this.selectedVulnerability = vulnerability : this.selectedVulnerability = null;
    }
  }

  deselectVulnerability(vulnerability: any) {
    vulnerability.active = false;
    this.selectedVulnerability = null;
  }

  saveForm(value: CreateBugReportInput) {
    let error = false;
//    console.log(value);

    if(!this.selectedAsset) {
      this.notifyService.showInfo("Please select asset", "Info");
      error = true;
    }

    if(!this.selectedVulnerability){
      this.notifyService.showInfo("Please select weakness", "Info");
      error = true;
    }
    
    //check if description is same as template
    if(value.description === this.value){
      this.notifyService.showInfo("Please add valid description", "Info");
      error = true;
    }

    //check if description has any of the placeholders
    if (value.description !== this.value) {
      this.placeholders.every((placeholder, index) => {
        if (value.description?.includes(placeholder)) {
          this.notifyService.showInfo("Please add valid description", "Info");
          error = true;
        }
      })
    }
    
    if (!error) {
      this.submitting = true;
      value.projectDomainId = this.selectedAsset.id;
      value.vulnerabilityId = this.selectedVulnerability.id;
      value.status = BugStatus.Open;
      value.severity = this.severity ? this.severity : VulnerabilitySeverity.Low;
  //    console.log(value);

      this.hackerService.createBugReport(value).subscribe(
        {
          next: result => {
            this.submitting = false;
            this.notifyService.showSuccess("Bug Report created successfully", "Success");
            this.router.navigateByUrl('/hacker/projects');
          },
          error: error => {
            this.submitting = false;
            this.notifyService.showError("Something went wrong creating bug report, please try again", "Error");
          }
        }
      )
    }

    error = false;
  }

  handleMouseOver(highlightedLevel: HTMLElement) {
    let levelsNodes = document.querySelectorAll('.levels');
    let levelNode = levelsNodes[0];
    let levels = levelNode.querySelectorAll('.level');
    // let status = levelNode.querySelector('.status');
    let status = document.querySelector('.status');
    let statusClass = document.querySelector('.statusClass');

    // Get surrounding boxes
    let previousSiblings = this.getPreviousSiblings(Array.from(levels), highlightedLevel);
    let nextSiblings = this.getNextSiblings(Array.from(levels), highlightedLevel);

    // Mark previous boxes as highlighted
    this.setClass(previousSiblings, 'highlighted');

    // If any of the next boxes are marked as selected, decrease their opacity
    if (nextSiblings.length > 0) {
      let selectedNextSiblings = nextSiblings.filter(nextSibling => nextSibling.classList.contains('selected'));
      if (selectedNextSiblings.length > 0) {
        this.setClass(selectedNextSiblings, 'dimmed');
      }
    }

    // Change text to match currently highlighted boxes
    this.setStatusText(status, highlightedLevel.dataset['value']);
    // Change status class to match currently highlighted boxes
    this.setStatusClass(statusClass, highlightedLevel.dataset['value']);
  }

  handleMouseLeave(highlightedLevel: HTMLElement) {
    let levelsNodes = document.querySelectorAll('.levels');
    let levelNode = levelsNodes[0];
    let levels = levelNode.querySelectorAll('.level');
    // let status = levelNode.querySelector('.status');
    let status = document.querySelector('.status');
    let statusClass = document.querySelector('.statusClass');

    this.removeClass(Array.from(levels), 'dimmed');

    // Get surrounding boxes
    let previousSiblings = this.getPreviousSiblings(Array.from(levels), highlightedLevel);

    // Mark previous boxes as unhighlighted
    this.removeClass(previousSiblings, 'highlighted');

    // Change text to match currently highlighted boxes
    let activeLevels = levelNode.querySelectorAll('.selected');
    if (activeLevels.length == 0) {
      this.setStatusText(status, '0');
      this.setStatusClass(statusClass, '0');
    } else {
      this.setStatusText(status, (activeLevels.length - 1).toString());
      this.setStatusClass(statusClass, (activeLevels.length - 1).toString());
    }
  }

  handleLevelClick(selectedLevel: HTMLElement) {
    let levelsNodes = document.querySelectorAll('.levels');
    let levelNode = levelsNodes[0];
    let levels = levelNode.querySelectorAll('.level');
    // let status = levelNode.querySelector('.status');
    let status = document.querySelector('.status');

    this.removeClass(Array.from(levels), 'selected');

    let previousSiblings = this.getPreviousSiblings(Array.from(levels), selectedLevel);

    this.setClass(previousSiblings, 'selected');

    this.severity = parseInt(selectedLevel.dataset['value'] as string);
//    console.log(this.severity);
  }

  toggleDescriptionPreview() {
    this.descriptionPreview = !this.descriptionPreview;
  }
  
  toggleImpactPreview() {
    this.impactPreview = !this.impactPreview;
  }

  // <------------ Helpers ------------>
  getPreviousSiblings(levels: any[], highlightedLevel: HTMLElement) {
    let previousSiblings = levels.filter(level => parseInt(level.dataset.value) <= parseInt(highlightedLevel.dataset['value'] as string));
    return previousSiblings;
  }

  getNextSiblings(levels: any[], highlightedLevel: HTMLElement) {
    let nextSiblings = levels.filter(level => parseInt(level.dataset.value) > parseInt(highlightedLevel.dataset['value'] as string));
    return nextSiblings;
  }

  removeClass(levels: any[], className: string) {
    levels.forEach(level => {
      level.classList.remove(className);
    });
  }

  setClass(levels: any[], className: string) {
    levels.forEach(sibling => {
      sibling.classList.remove(className);
      sibling.classList.add(className);
    });
  }
  
  setStatusClass(statusClass: Element | null, key: string | undefined) {
    if(statusClass && key){
      let severityClass = this.severityClasses[key];
  //    console.log(severityClass);
      const severityClassesArray = Object.values(this.severityClasses);
      severityClassesArray.forEach((element) => statusClass.classList.remove(element));
      statusClass.classList.add(severityClass);
    }
  }
  
  setStatusText(status: Element | null, key: string | undefined) {
    if(status && key){
      status.textContent = this.proficiencyLevelMap[key];
    }
  }
}