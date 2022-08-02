import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdminService } from 'src/app/core/_services/admin.services';
import { NotificationService } from 'src/app/core/_services/notification.service';

@Component({
  selector: 'app-block-client-dialog',
  templateUrl: './block-client-dialog.component.html',
  styleUrls: ['./block-client-dialog.component.css']
})
export class BlockClientDialogComponent implements OnInit {
  reasonString:string = '';
  isActiveCustomer?:boolean;
  constructor(
    public adminService:AdminService,
    public notify:NotificationService,
    @Inject(MAT_DIALOG_DATA) public data: {userId:string,id:number},
    private dialogRef: MatDialogRef<BlockClientDialogComponent>) { }

  ngOnInit(): void {
this.getCustomerByAdmin();
  }

  getCustomerByAdmin(){
    this.adminService.getCustomerFromAdmin(this.data.id).subscribe({
      next:results => {
        this.isActiveCustomer = results.result.isActive;  
    //    console.log(this.isActiveCustomer);
    
      },
      error:() => console.error("the customer could not be retreived successfully"),
      complete:() => "The item was completed successfully"
    });
  }

  BlockFromAdmin(){
    const thedata = {
      userId:this.data.userId,
      reason:this.reasonString
    }
    

    this.adminService.blockUserFromAdmin(thedata).subscribe({
      next:results => {
          this.isActiveCustomer = true;
          this.dialogRef.close({data:results.result.isActive});
      },
      error:() => this.notify.showError("The user could not be able to be blocked successfully","Sorry!"),
      complete:() => this.notify.showSuccess("This user has been blocked successfully","Congratulations")
    })
  }

  unBlockFromAdmin(){
    const thedata = {
      userId:this.data.userId,
      reason:this.reasonString
    }
    this.adminService.unblockUserFromAdmin(thedata).subscribe({
      next:results => {
          this.isActiveCustomer = results.result.isActive;
          this.dialogRef.close({data:results.result.isActive});
        
      },
      error:() => this.notify.showError("The user could not be able to be unblocked successfully","Sorry!"),
      complete:() => this.notify.showSuccess("This user has been unblocked successfully","Congratulations")
    })
  }

  cancel() {
    // closing itself and sending data to parent component
    this.dialogRef.close({ data: 'you cancelled' })
  }      

}
