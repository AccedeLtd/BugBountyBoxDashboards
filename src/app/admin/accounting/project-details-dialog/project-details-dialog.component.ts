import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-project-details-dialog',
  templateUrl: './project-details-dialog.component.html',
  styleUrls: ['./project-details-dialog.component.css']
})
export class ProjectDetailsDialogComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<ProjectDetailsDialogComponent>) { }

  ngOnInit(): void {
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
