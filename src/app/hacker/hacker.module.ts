import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HackerRoutingModule } from './hacker-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProjectsComponent } from './projects/projects.component';
import { MaterialModule } from '../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavComponent } from './nav/nav.component';
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
import { NgApexchartsModule } from 'ng-apexcharts';
import { WithdrawDialogComponent } from './settings/withdraw-dialog/withdraw-dialog.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { RecentUpdatesComponent } from './recent-updates/recent-updates.component';
import { PaymentMethodsComponent } from './payment-methods/payment-methods.component';
import { MarkdownModule } from 'ngx-markdown';
import { SearchFilterPipe } from './pipes/search-filter.pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { RichTextEditorModule } from '@syncfusion/ej2-angular-richtexteditor';
import { AccountingComponent } from './accounting/accounting.component';
import { ProjectDetailsDialogComponent } from './accounting/project-details-dialog/project-details-dialog.component';
import { TasksComponent } from './tasks/tasks.component';
import { KanbanModule } from '@syncfusion/ej2-angular-kanban';
import { EditPaymentMethodDialogComponent } from './settings/edit-payment-method-dialog/edit-payment-method-dialog.component';
import { BugsReportsComponent } from './bugs-reports/bugs-reports.component';
import { BugReportDetailComponent } from './bugs-reports/bug-report-detail/bug-report-detail.component';
import { HackerComponent } from './hacker.component';
import { SideNavComponent } from './side-nav/side-nav.component';

@NgModule({
  declarations: [
    HackerComponent,
    NavComponent,
    DashboardComponent,
    ProjectsComponent,
    ProjectDetailComponent,
    BountyActivityComponent,
    BountyActivityDetailComponent,
    PaymentsComponent,
    PaymentDetailsComponent,
    SettingsComponent,
    PaymentMethodDialogComponent,
    WithdrawDialogComponent,
    UserProfileComponent,
    RecentUpdatesComponent,
    PaymentMethodsComponent,
    SearchFilterPipe,
    AccountingComponent,
    ProjectDetailsDialogComponent,
    TasksComponent,
    EditPaymentMethodDialogComponent,
    BugsReportsComponent,
    BugReportDetailComponent,
    SideNavComponent,
  ],
  imports: [
    CommonModule,
    HackerRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,   
    LayoutModule,
    SharedModule,
    NgApexchartsModule,
    MarkdownModule.forRoot(),
    NgxPaginationModule,
    RichTextEditorModule,
    KanbanModule,
  ],
  providers: [
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 5000, panelClass: 'snackbar-center' } },
  ]
})
export class HackerModule { }
