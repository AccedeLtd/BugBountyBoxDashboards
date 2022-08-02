import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-rating-dialog',
  templateUrl: './rating-dialog.component.html',
  styleUrls: ['./rating-dialog.component.css']
})
export class RatingDialogComponent implements OnInit {
  form!: FormGroup;
  step = 1;
  submitting: boolean | undefined;
  ratingkey = '3Brating';
  rating!: string;

  constructor(
    private dialogRef: MatDialogRef<RatingDialogComponent>,
    private _snackBar: MatSnackBar,
    private fb: FormBuilder,
  ) 
  {
    this.form = this.fb.group({
      rating: ['', Validators.required],
    });
  }

  ngOnInit(): void {
  }

  next() {
    this.submitting = true;
    setTimeout(() => {
      this.submitting = false;
      this.step++;
    }, 2000);
  }

  closeDialog() {
    this.dialogRef.close();
    window.location.reload();
  }

  submit() {
    const controls = (this.form.controls) as any;
    const rating = controls.rating.value;

    if(rating) {
      this.submitting = true;
      localStorage.setItem(this.ratingkey, rating);
      this.rating = rating;

      // if (localStorage.getItem(this.ratingkey) == null) {
      //   localStorage.setItem(this.ratingkey, rating);
      // }
      // else {
      //   //update
      //   const see = localStorage.getItem(this.ratingkey)!;
      //   let seer = parseInt(see) + parseInt(rating);
      //   localStorage.setItem(this.ratingkey, seer.toString());
      //   this.rating = rating;
      // }
      setTimeout(() => {
        this.submitting = false;
        this.step++;
      }, 2000);
    }
    else {
      this._snackBar.open('Rating is required', 'Close');
    }
  }
}
