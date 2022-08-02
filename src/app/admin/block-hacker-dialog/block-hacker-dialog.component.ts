import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdminService } from 'src/app/core/_services/admin.services';
import { NotificationService } from 'src/app/core/_services/notification.service';

@Component({
  selector: 'app-block-hacker-dialog',
  templateUrl: './block-hacker-dialog.component.html',
  styleUrls: ['./block-hacker-dialog.component.css']
})
export class BlockHackerDialogComponent implements OnInit {
  reasonString:string = '';
  isActiveCustomer?:boolean;
  constructor(
    public adminService:AdminService,
    public notify:NotificationService,
    @Inject(MAT_DIALOG_DATA) public data: {userId:string,id:number},
    private dialogRef: MatDialogRef<BlockHackerDialogComponent>) { }

  ngOnInit(): void {
    this.getHackerByAdmin();
//    console.log(this.data.id);
  }

  getHackerByAdmin(){
    this.adminService.getHackerByUserId(this.data.userId).subscribe({
      next:results => {
        this.isActiveCustomer = results.result.isActive;  
    //    console.log(this.isActiveCustomer);
    
      },
      error:() => console.error("the hacker could not be retreived successfully"),
      complete:() => "The hacker was completed successfully"
    });
  }

  BlockFromAdmin(){
    const thedata = {
      userId:this.data.userId,
      reason:this.reasonString
    }
    

    this.adminService.blockHackerFromAdmin(thedata).subscribe({
      next:results => {
          this.isActiveCustomer = true;
          this.dialogRef.close({data:results.result.isActive});
      },
      error:() => this.notify.showError("The hacker could not be able to be blocked successfully","Sorry!"),
      complete:() => this.notify.showSuccess("This jacker has been blocked successfully","Congratulations")
    })
  }

  unBlockFromAdmin(){
    const thedata = {
      userId:this.data.userId,
      reason:this.reasonString
    }
    this.adminService.unblockHackersFromAdmin(thedata).subscribe({
      next:results => {
          this.isActiveCustomer = results.result.isActive;
          this.dialogRef.close({data:results.result.isActive});
        
      },
      error:() => this.notify.showError("The hacker could not be able to be unblocked successfully","Sorry!"),
      complete:() => this.notify.showSuccess("This hacker has been unblocked successfully","Congratulations")
    })
  }

  cancel() {
    // closing itself and sending data to parent component
    this.dialogRef.close({ data: 'you cancelled' })
  }      


}
