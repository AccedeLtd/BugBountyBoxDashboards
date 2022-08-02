import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-project-review-dialog',
  templateUrl: './project-review-dialog.component.html',
  styleUrls: ['./project-review-dialog.component.css']
})
export class ProjectReviewDialogComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<ProjectReviewDialogComponent>) { }

  ngOnInit(): void {
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
