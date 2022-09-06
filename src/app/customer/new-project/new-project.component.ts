import { Component, Inject, ViewChild } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CreateProjectRequestJson, Domain} from 'src/app/core/_models/createProjectRequestJson';
import { CustomerService } from 'src/app/core/_services/customer.service';
import { TestAndRequirementJson } from 'src/app/core/_models/TestAndRequirementJson';
import { NotificationService } from 'src/app/core/_services/notification.service';
import { HTTPResponseWrapper } from 'src/app/core/_models';
import { RequirementLevel } from 'src/app/core/_models/listCustomerProjectJson';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-project',
  templateUrl: './new-project.component.html',
  styleUrls: ['./new-project.component.css']
})
export class NewProjectComponent {
  @ViewChild('projectForm', { static: false }) public projectForm!: NgForm;  
  searchInput!: string;
  sideNavOpened = false;
  domainsbyCommas = ""; 
  allTheAssetTypes:RequirementLevel[] = [];
  testTypesList?: TestAndRequirementJson[];
  requirementLevelsList?: TestAndRequirementJson[];
  createProjectResponse?: HTTPResponseWrapper<CreateProjectRequestJson>;
  theDomain?:Domain;
  createProject: CreateProjectRequestJson = {
    title: '',
    description: '',
    bounty: undefined,
    projectLogoUrl:  '',
    projectStatus: 0,
    // domains: this.cloneDomains,
    domains:this.domainsbyCommas.split(",").map(e => {
      return {
        ...this.theDomain,
        assetTypeId:0,
        domain:e
      }
    }),
    requirementLevelId:0,
    testTypeId: 0
  };
  testTypeName!: string;
  user: any;
  authUser: any;
  userName: any;
  loading: boolean = false;
  reviewloading: boolean = false;
  newProjectForm!: FormGroup;
  testingTypes$: any;
  submitting: boolean | undefined;
  assetTypeSelection:number = 0;
  file!: File;
  uploading: boolean = false;

  constructor(
    @Inject(DOCUMENT) public document: Document,
    public oidcSecurityService: OidcSecurityService,
    public dialog: MatDialog,
    public _snackBar: MatSnackBar,
    public customerService: CustomerService,
    private notifyService: NotificationService,
    public _router: Router,
  ) {

  }

  async ngOnInit(): Promise<void> {
    this.getTestTypes();
    this.getRequirementLevels();
    this.gettheAssetTypes();
  }

  onAssetChanged(value:number,domain:string){
    this.assetTypeSelection = value;
    this.addDomainsToProject(domain,value);
//    console.log(`${value} and ${domain}`);
  }

  addDomainsToProject(domain:string,assetId:number){
//    console.log(this.createProject.domains);
    let domainProj = this.createProject.domains?.find(e => e.domain === domain);
    if(!domainProj){
      const data = {
        assetTypeId:assetId,
        domain:domain
      };
      this.createProject.domains?.push(data);
      this.createProject.domains = this.createProject.domains?.filter(e => this.domainsbyCommas.split(",").includes(`${e.domain}`));
       
      // this.showToasterSuccess(`Asset Type with domain ${domain} and asset type id of ${assetId} have been added to domain successfully`);
  //    console.log(this.createProject.domains);
  //    console.log(this.domainsbyCommas.split(","));
    } else {
      this.createProject.domains = this.createProject.domains?.filter(e => this.domainsbyCommas.split(",").includes(`${e.domain}`));
      this.createProject.domains?.forEach(e => {
        if(e && (e.domain === domain && e.assetTypeId !== assetId)){
          e.assetTypeId = assetId;
        }
      })
  //    console.log(this.createProject.domains);  
      // this.showToasterSuccess("The values were updated based on the domain string given");
    }   
  }

  showToasterSuccess(message: string) {
    this.notifyService.showSuccess(message, "Congratulations")
  }

  showToasterError(message: string) {
    this.notifyService.showError(message, "Sorry")
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

  logout() {
    this.oidcSecurityService.logoff();
  }

  saveAsDraft() {
    if (!this.projectForm.valid) {
      this._snackBar.open("Please fill all fields");
    } else {
      this.loading = true;
      this.createProject.projectStatus = 0;
      this.createProject.domains = this.createProject.domains?.filter(e => this.domainsbyCommas.split(",").includes(`${e.domain}`));
  //    console.log(JSON.stringify(this.createProject));
      this.customerService.createProject(this.createProject).subscribe({
        next:result => {
      //    console.log(`${JSON.stringify(result)}`);
          this.loading = false;
          result.success === true ? this.showToasterSuccess("Your project was saved as a draft successfully") : this.showToasterError("Your project could not be saved as a draft successfully");
          this._router.navigateByUrl('/customer/projects');
        },
        error:() => this.showToasterError("Your project could not be saved as a draft successfully"),
        complete:() => "the process went through successfully"
  
      });      
    }
  }

  submitForReview() {
    const domains = this.domainsbyCommas.split(",").length;
    const domainsWithAssetsTypes = this.createProject.domains = this.createProject.domains?.filter(e => this.domainsbyCommas.split(",").includes(`${e.domain}`));

    if (this.projectForm.invalid) {
      this._snackBar.open("Please fill all fields");
    }
    // else if (domainsWithAssetsTypes?.length < 0) {
    //   this._snackBar.open("Please add a domain");
    // }
    else {
      this.reviewloading = true;
      this.createProject.projectStatus = 1;
      this.createProject.domains = this.createProject.domains?.filter(e => this.domainsbyCommas.split(",").includes(`${e.domain}`));
  //    console.log(JSON.stringify(this.createProject));
      this.customerService.createProject(this.createProject).subscribe({
        next: result => {
      //    console.log(`${JSON.stringify(result)}`);
          this.reviewloading = false;
          result.success === true ? this.showToasterSuccess("Your project was submitted successfully and is currently under review") : this.showToasterError("Your project could not be submitted successfully");
          this._router.navigateByUrl('/customer/projects');
        },
        error: () => this.showToasterError("Your project could not be submitted successfully")
      })
    }
  }

  changeTestType(testTypeName: any) {
    this.testTypeName = testTypeName;
  }

  onChange(event:any) {
    this.file = event.target.files[0];
    this.onUpload();
  }

  onUpload() {
    this.uploading = true;
//    console.log(this.file);
    this.customerService.getProjectLogoUrl(this.file).subscribe({
       next: result => {
         if(this.file.type.includes("image/")){
          this.createProject.projectLogoUrl = result.result.url;
          this.uploading = false;
         }
        },
        error:() => {
          this.notifyService.showError("Image upload was not successful", "Error");
          this.uploading = false;
        }
      });
  }

  spaceChecker(event: any) {
    if(event.charCode == 32)
      this._snackBar.open("Spaces not allowed in domains, separate domains with commas");
    
    return event.charCode != 32;
  }
}