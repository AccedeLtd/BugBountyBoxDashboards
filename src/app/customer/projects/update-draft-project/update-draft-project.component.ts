import { Component, Inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CreateProjectRequestJson, Domain} from 'src/app/core/_models/createProjectRequestJson';
import { CustomerService } from 'src/app/core/_services/customer.service';
import { TestAndRequirementJson } from 'src/app/core/_models/TestAndRequirementJson';
import { NotificationService } from 'src/app/core/_services/notification.service';
import { HTTPResponseWrapper } from 'src/app/core/_models';
import { ListCustomerProjectJson, RequirementLevel } from 'src/app/core/_models/listCustomerProjectJson';
import { ActivatedRoute, Router } from '@angular/router';
import { UpdateProjectDomainDialogComponent } from '../update-project-domain-dialog/update-project-domain-dialog.component';

@Component({
  selector: 'app-update-draft-project',
  templateUrl: './update-draft-project.component.html',
  styleUrls: ['./update-draft-project.component.css']
})
export class UpdateDraftProjectComponent implements OnInit {
  searchInput!: string;
  sideNavOpened = false;
  domainsbyCommas = "";
  cloneDomains?: string[] = this.detailedProject?.domains.map(e => e.name)
  testTypesList?: TestAndRequirementJson[];
  requirementLevelsList?: TestAndRequirementJson[];
  detailedProject?:ListCustomerProjectJson;
  allTheAssetTypes:RequirementLevel[] = [];
  file!: File;
  uploading: boolean = false;
  requirementId?:number = this.detailedProject?.requirementLevel?.id;
  createProjectResponse?: HTTPResponseWrapper<CreateProjectRequestJson>;
  // allDomains:Domain[] = [];
  theDomain?:Domain;
  valueId:number = 0;

  createProject: CreateProjectRequestJson = {
    title: this.detailedProject?.title,
    description: this.detailedProject?.description,
    bounty: this.detailedProject?.bounty,
    projectStatus: this.detailedProject?.projectStatus,
    // domains: this.cloneDomains,
    domains:this.domainsbyCommas.split(",").map(e => {
      return {
        ...this.theDomain,
        assetTypeId:0,
        domain:e
      }
    }),
    requirementLevelId:this.requirementId,
    testTypeId: this.detailedProject?.testType.id
  };
  showReportForm: boolean = false;
  user: any;
  authUser: any;
  userName: any;
  loading: boolean = false;
  reviewloading: boolean = false;
  draftloading: boolean = false;
  newProjectForm!: FormGroup;
  testingTypes$: any;
  submitting: boolean | undefined;
  recordName:number = 0;
  assetTypeSelection:number = 0;
  actualDomains?:Domain[];
  testTypeName: any;
  constructor(
    @Inject(DOCUMENT) public document: Document,
    public oidcSecurityService: OidcSecurityService,
    public dialog: MatDialog,
    public _snackBar: MatSnackBar,
    public customerService: CustomerService,
    private notifyService: NotificationService,
    private _route: ActivatedRoute,
    private router: Router
  ) {

  }

  async ngOnInit(): Promise<void> {
    this._route.params.subscribe((params) => {
      this.recordName = params["id"];
      //load record data
    });
    this.getTestTypes();
    this.gettheAssetTypes();
    this.getRequirementLevels();
    this.getProjectToUpdate(this.recordName);
  }

  showToasterSuccess(message: string) {
    this.notifyService.showSuccess(message, "Congratulations")
  }

  showToasterError(message: string) {
    this.notifyService.showError(message, "Sorry")
  }

  gettheAssetTypes(){
    return this.customerService.getAllAssetTypes().subscribe({
      next:results => {
        this.allTheAssetTypes = results.result.data;
    //    console.log(this.allTheAssetTypes);
      },
      error:(err) => { this.notifyService.showError(`the request could not be completed successfully: ${err}`,"Sorry!")},
      complete:() => console.info("The asset type operation completed successfully")
    })
  }

  onAssetChanged(value:number,domain?:string){
    this.assetTypeSelection = value;
    this.addDomainsToProject(`${domain}`,value);
//    console.log(`${value} and ${domain}`);  
  }

  addDomainsToProject(domain:string,assetId:number){
//    console.log(this.createProject.domains);
    let domainProj = this.createProject.domains?.find(e => e.name === domain);
    if(!domainProj){
      const data = {
        assetTypeId:assetId,
        domain:domain
      };
      this.createProject.domains?.push(data);
      this.actualDomains = this.createProject.domains?.filter(e => this.domainsbyCommas.split(",").includes(`${e.domain}`));
       
      this.showToasterSuccess(`Asset Type with domain ${domain} and asset type id of ${assetId} have been added to domain successfully`);
  //    console.log(this.createProject.domains);
  //    console.log(this.domainsbyCommas.split(","));
    } else {
      // this.actualDomains = this.createProject.domains?.filter(e => this.domainsbyCommas.split(",").includes(`${e.domain}`));
      this.createProject.domains?.forEach(e => {
        if(e && (e.name === domain)){  
          let assetValue = this.allTheAssetTypes.find(j => j.id === assetId)
          if(assetValue){
            e.assetType = assetValue.type;
          }
        }
      })
  //    console.log(this.createProject.domains);  
      this.showToasterSuccess("The values were updated based on the domain string given");
    }
   
  }

  deleteDomain(domainId?:number){
    this.customerService.deleteCustomerDomain(domainId).subscribe(
      result => {
    //    console.log(JSON.stringify(result))
        // this.actualDomains = this.actualDomains?.filter(e => e.id !== domainId);
        this.actualDomains = this.actualDomains?.filter(e => e.id !== domainId);
        result.success === true ? this.showToasterSuccess("your domain has been deleted successfully") : this.showToasterError(result.error.message);
      }
    )
  }

  openDomainDialog(){
    const dialogRef = this.dialog.open(UpdateProjectDomainDialogComponent,{
      data:{projectId:this.recordName},
      height:'500px',
      width:'500px'
    })

    dialogRef.afterClosed().subscribe(result => {
      if(result)
        this.actualDomains = result;
    });
  }

  saveForm() {
    this.loading = true;

    this.customerService.UpdateProject(this.createProject).subscribe({
      next:result => {
        //console.log(`${JSON.stringify(result)}`);
        this.createProjectResponse = result;
        this.loading = false;
        result.success === true ? this.showToasterSuccess("Your project was updated and saved successfully") : this.showToasterError("Your project could not be updated successfully");
        this.router.navigateByUrl('/customer/projects');
      },
      error:() => {
        this.notifyService.showError("The form could not be saved successfully","sorry");
        this.loading = false;
      }
  })
  }

  toggleSideNav() {
    this.sideNavOpened = !this.sideNavOpened;
  }

  getTestTypes() {
    return this.customerService.getAllTestTypes().subscribe({
      next: (results: any) => this.testTypesList = results.result.data,
      error: (err) => console.error(err),
      complete: () => "the testtypes have been retreived successfully"
    })
  }

  getRequirementLevels() {
    return this.customerService.getAllRequirementLevels().subscribe({
      next: (results: any) => this.requirementLevelsList = results.result.data,
      error: (err) => console.error(err),
      complete: () => "the requirement levels have been retreived successfully"
    })
  }

  logout() {
    this.oidcSecurityService.logoff();
  }

  getProjectToUpdate(projectId: number) {
    this.customerService.getCustomerProject(projectId).subscribe(
      result => {
        this.detailedProject = result;
        this.createProject.id = this.detailedProject?.id;
        this.createProject.projectLogoUrl = this.detailedProject?.projectLogoUrl;
        this.createProject.title = this.detailedProject?.title;
        this.createProject.description = this.detailedProject?.description;
        this.createProject.bounty = this.detailedProject?.bounty;
        this.createProject.testTypeId = this.detailedProject?.testType.id;
        this.testTypeName = this.detailedProject?.testType.name;
        this.createProject.requirementLevelId = this.detailedProject?.requirementLevel?.id;
        this.createProject.domains = this.detailedProject?.domains;
    //    console.log(JSON.stringify(this.detailedProject));
        this.actualDomains = this.createProject.domains;
      }
    )
  }

  toggleReportForm() {
    this.showReportForm = !this.showReportForm;
  }

  openDraftDialog() {
    this.loading = true;
    this.createProject.projectStatus = 0;
    // this.createProject.domains = this.domainsbyCommas.split(',');
//    console.log(JSON.stringify(this.createProject));

    this.customerService.createProject(this.createProject).subscribe(
      result => {
    //    console.log(`${JSON.stringify(result)}`);
        this.loading = false;
        result.success === true ? this.showToasterSuccess("Your project was saved as a draft successfully") : this.showToasterError("Your project could not be saved as a draft successfully");
        this.router.navigateByUrl('/customer/projects');
      }
    )
  }

  openReviewDialog() {
    this.customerService.customerMovesDraftToReview(this.recordName).subscribe(
      result => {
    //    console.log(`${JSON.stringify(result)}`);
        this.reviewloading = !this.reviewloading;

        if (result.success) {
          setTimeout(() => {
            result.success === true ? this.showToasterSuccess('Your project has been moved to review successfully') : this.showToasterError(result.error.details);
          }, 2000);
          this.router.navigateByUrl('/customer/projects');
        }
      }
    )
  }

  moveFromReviewToDraft() {
    this.draftloading = true;
    this.customerService.customerMovesReviewToDraft(this.recordName).subscribe(
      result => {
    //    console.log(`${JSON.stringify(result)}`);
        this.draftloading = false;

        if (result.success) {
          setTimeout(() => {
            result.success === true ? this.showToasterSuccess('Your project has been moved back to draft successfully') : this.showToasterError(result.error.details);
          }, 2000);
          this.router.navigateByUrl('/customer/projects');
        }
      }
    )
  }

  changeTestType(testType: any) {
    this.createProject.testTypeId = testType.id;
    this.testTypeName = testType.name;
  }

  updateImage(inputElement: HTMLInputElement) {
    if (!inputElement.files?.length) return;

    this.file = inputElement.files[0];
    this.uploading = true;
    this.customerService.getProjectLogoUrl(this.file).subscribe({
      next: result => {
        if (this.file.type.includes("image/")) {
          this.createProject.projectLogoUrl = result.result.url;
          this.uploading = false;
        }
      },
      error: () => {
        this.notifyService.showError("Image upload was not successful", "Error");
        this.uploading = false;
      }
    });
  }

}
