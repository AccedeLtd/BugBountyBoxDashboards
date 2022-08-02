import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavComponent } from '../components/nav/nav.component';
import { MaterialModule } from '../material.module';
import { FormsModule } from '@angular/forms';
import { LayoutModule } from '@angular/cdk/layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { FilterPipePipe } from './pipes/filter-pipe.pipe';

@NgModule({
  declarations: [
    // NavComponent
  
    // FilterPipePipe
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    FormsModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    LayoutModule
  ],
  exports: [
    // NavComponent,
    // FilterPipePipe
  ]
})
export class SharedModule { }
