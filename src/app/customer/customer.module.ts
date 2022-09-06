import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProjectsComponent } from './projects/projects.component';
import { MaterialModule } from '../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { LayoutModule } from '@angular/cdk/layout';
import { ProjectDetailComponent } from './projects/project-detail.component';
import { BountyActivityComponent } from './bounty-activity/bounty-activity.component';
import { BountyActivityDetailComponent } from './bounty-activity/bounty-activity-detail.component';
import { PaymentsComponent } from './payments/payments.component';
import { PaymentDetailsComponent } from './payments/payment-details.component';
import { SettingsComponent } from './settings/settings.component';
import { PaymentMethodDialogComponent } from './settings/payment-method-dialog/payment-method-dialog.component';
import { SharedModule } from '../shared/shared.module';
import { ProjectReviewDialogComponent } from './projects/project-review-dialog/project-review-dialog.component';
import { HackersComponent } from './hackers/hackers.component';
import { CustomerRoutingModule } from './customer-routing.module';
import { CustomerNavComponent } from './customer-nav/customer-nav.component';
import { HackersDetailComponent } from './hackers/hackers-detail.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { TransfersComponent } from './transfers/transfers.component';
import { AccountingComponent } from './accounting/accounting.component';
import { ProjectDetailsDialogComponent } from './accounting/project-details-dialog/project-details-dialog.component';
import { NewProjectComponent } from './new-project/new-project.component';
import { AddFundsDialogComponent } from './settings/add-funds-dialog/add-funds-dialog.component';
import { RatingDialogComponent } from './projects/rating-dialog/rating-dialog.component';
import { NgxStarRatingModule } from 'ngx-star-rating';
import { SplitIntoArrayPipe } from './pipes/split-into-array.pipe';
import { NgxPayPalModule } from 'ngx-paypal';
import { UpdateDraftProjectComponent } from './projects/update-draft-project/update-draft-project.component';
import { PayoutsDialogComponent } from './settings/payouts-dialog/payouts-dialog.component';
import { FilterPipePipe } from '../shared/pipes/filter-pipe.pipe'; 
import { NgxPaginationModule } from 'ngx-pagination';
import { SearchFilterPipe } from './pipes/search-filter.pipe';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { RichTextEditorModule } from '@syncfusion/ej2-angular-richtexteditor';
import { UpdateProjectDomainDialogComponent } from './projects/update-project-domain-dialog/update-project-domain-dialog.component';
import { CustomerSideNavComponent } from './customer-side-nav/customer-side-nav.component';

@NgModule({
  declarations: [
    CustomerNavComponent,
    DashboardComponent,
    ProjectsComponent,
    ProjectDetailComponent,
    BountyActivityComponent,
    BountyActivityDetailComponent,
    PaymentsComponent,
    PaymentDetailsComponent,
    SettingsComponent,
    PaymentMethodDialogComponent,
    AddFundsDialogComponent,
    RatingDialogComponent,
    ProjectReviewDialogComponent,
    ProjectDetailsDialogComponent,
    HackersComponent,
    TransfersComponent,
    AccountingComponent,
    HackersDetailComponent,
    NewProjectComponent,
    SplitIntoArrayPipe,
    UpdateDraftProjectComponent,
    PayoutsDialogComponent,
    FilterPipePipe,
    SearchFilterPipe,
    UpdateProjectDomainDialogComponent,
    CustomerSideNavComponent
  ],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    MaterialModule,
    FormsModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    NgxPaginationModule,
    LayoutModule,
    SharedModule,
    NgApexchartsModule,
    ReactiveFormsModule,
    NgxStarRatingModule,
    NgxPayPalModule,
    RichTextEditorModule,
  ],
  providers: [
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 5000, panelClass: 'snackbar-center' } },
  ]
})
export class CustomerModule {
}
