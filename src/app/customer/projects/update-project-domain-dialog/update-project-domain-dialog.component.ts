import { Component, Inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { RequirementLevel } from 'src/app/core/_models/allProjectsResponseJson';
import { CustomerService } from 'src/app/core/_services/customer.service';
import {MatDialogRef,MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AddDomain } from 'src/app/core/_models/addDomainJson';
import { NotificationService } from 'src/app/core/_services/notification.service';

@Component({
  selector: 'app-update-project-domain-dialog',
  templateUrl: './update-project-domain-dialog.component.html',
  styleUrls: ['./update-project-domain-dialog.component.css']
})
export class UpdateProjectDomainDialogComponent implements OnInit {

  public requirementLevels:RequirementLevel[] = [];
  constructor(
    public dialogRef: MatDialogRef<UpdateProjectDomainDialogComponent>,
    private customerService:CustomerService,
    @Inject(MAT_DIALOG_DATA) public data:{projectId:number},
    private notificationService:NotificationService){}

  ngOnInit(): void {
    this.getAllAssetTypes();
  }
  domainName:string = "";
  domainAssetType:number = 0;

  getAllAssetTypes(){
    this.customerService.getAllAssetTypes().subscribe({
      next:results => {
        this.requirementLevels = results.result.data;
        // console.log(this.requirementLevels);
      },
      error:() => "Asset Types could not be retrieved successfully",
      complete:() => "The asset type has been completed successfully"
    })
  }

  getActualCustomerProject(){
    this.customerService.getCustomerProject(this.data.projectId).subscribe({
      next:results => {
          let resultValue:{id:number,name:string,assetType:string}[]  = [];
          resultValue = results.domains;
          // console.log(resultValue);
          this.dialogRef.close(resultValue);
      },
      error:() => "project could not be retrieved successfully",
      complete:() => "project was completed successfully"
    })
  }

  updateExistingProjectDomain(){
    const Value:AddDomain = {
      projectId:this.data.projectId,
      assetTypeId:this.domainAssetType,
      domain:this.domainName
    }
  

    // console.log(Value);
    this.customerService.addDtomainToExistingProject(Value).subscribe({
      next:results => {
        // console.log(results); 
        this.getActualCustomerProject();
      },
      error:() => this.notificationService.showError("domain could not be added successfully","sorry"),
      complete:() => this.notificationService.showSuccess("Domain was added to project successfully","COngratulations")
    })
  }

}
