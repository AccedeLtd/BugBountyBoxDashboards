import { ThisReceiver } from '@angular/compiler';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/core/_services/admin.services';
import { NotificationService } from 'src/app/core/_services/notification.service';

@Component({
  selector: 'app-validate-project-dialog',
  templateUrl: './validate-project-dialog.component.html',
  styleUrls: ['./validate-project-dialog.component.css']
})
export class ValidateProjectDialogComponent implements OnInit {

  constructor(
    private adminService:AdminService,
    private notifyService:NotificationService,
    @Inject(MAT_DIALOG_DATA) public data: number ,
    private dialogRef: MatDialogRef<ValidateProjectDialogComponent>,
    private router:Router
  ) { }

  ngOnInit(): void {
  }

  validateBug(){
    this.adminService.validateBugFromAdmin(this.data).subscribe(
      results => {
        if(results.success){
          this.notifyService.showSuccess("The bug has been validated successfully","Congratulations");
          this.router.navigateByUrl("/admin/bugs");
          this.dialogRef.close();
        }
        if(!results.success){
          this.notifyService.showError("The bug has not been validated successfully","Sorry");
        }
      }
    )
  }

}
