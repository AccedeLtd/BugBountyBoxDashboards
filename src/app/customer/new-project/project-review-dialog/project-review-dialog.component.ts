import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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

  @Output() notify:EventEmitter<string> = new EventEmitter<string>()
  onClick(){
    this.notify.emit('')
  }
  closeDialog() {
    this.dialogRef.close();
  }

}
