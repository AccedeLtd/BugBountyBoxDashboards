import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProjectsComponent } from './projects/projects.component';
import { MaterialModule } from '../material.module';
import { FormsModule } from '@angular/forms';
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
import { AdminNavComponent } from '../components/admin-nav/admin-nav.component';
import { ProjectReviewDialogComponent } from './projects/project-review-dialog/project-review-dialog.component';
import { HackersComponent } from './hackers/hackers.component';
import { ClientsComponent } from './clients/clients.component';
import { BountiesComponent } from './bounties/bounties.component';
import { VulnerabilitiesComponent } from './vulnerabilities/vulnerabilities.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { AdminPaymentDialogComponent } from './admin-payment-dialog/admin-payment-dialog.component';
import { AdminVulnerabilityDialogComponent } from './admin-vulnerability-dialog/admin-vulnerability-dialog.component';
import { UpdateVulnerabilityComponent } from './update-vulnerability/update-vulnerability.component';
import { DeleteVulnerabilityComponent } from './delete-vulnerability/delete-vulnerability.component';
import { ValidateProjectDialogComponent } from './validate-project-dialog/validate-project-dialog.component';
import { SplitToArrayPipePipe } from './pipes/split-to-array-pipe.pipe';
import { HackerToArrayPipePipe } from './pipes/hacker-to-array-pipe.pipe';
import { VulnerabilityToArrayPipePipe } from './pipes/vulnerability-to-array-pipe.pipe';
import { AddvulnToArrayPipePipe } from './pipes/addvuln-to-array-pipe.pipe';
import { ClientToArrayPipePipe } from './pipes/client-to-array-pipe.pipe';
import {NgxPaginationModule} from 'ngx-pagination';
import { BlockClientDialogComponent } from './block-client-dialog/block-client-dialog.component';
import { BlockHackerDialogComponent } from './block-hacker-dialog/block-hacker-dialog.component';
import { SearchFilterPipe } from './pipes/search-filter.pipe';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { VulnerabilityTypesComponent } from './vulnerability-types/vulnerability-types.component';
import { VulnerabilityTypeDialogComponent } from './vulnerability-types/vulnerability-type-dialog/vulnerability-type-dialog.component';
import { RichTextEditorModule } from '@syncfusion/ej2-angular-richtexteditor';
import { AccountingComponent } from './accounting/accounting.component';
import { ProjectDetailsDialogComponent } from './accounting/project-details-dialog/project-details-dialog.component';

@NgModule({
  declarations: [
    AdminNavComponent,
    DashboardComponent,
    ProjectsComponent,
    ProjectDetailComponent,
    BountyActivityComponent,
    BountyActivityDetailComponent,
    PaymentsComponent,
    PaymentDetailsComponent,
    SettingsComponent,
    PaymentMethodDialogComponent,
    ProjectReviewDialogComponent,
    HackersComponent,
    ClientsComponent,
    BountiesComponent,
    VulnerabilitiesComponent,
    AdminPaymentDialogComponent,
    AdminVulnerabilityDialogComponent,
    UpdateVulnerabilityComponent,
    DeleteVulnerabilityComponent,
    ValidateProjectDialogComponent,
    SplitToArrayPipePipe,
    HackerToArrayPipePipe,
    VulnerabilityToArrayPipePipe,
    AddvulnToArrayPipePipe,
    ClientToArrayPipePipe,
    SearchFilterPipe,
    BlockClientDialogComponent,
    BlockHackerDialogComponent,
    VulnerabilityTypesComponent,
    VulnerabilityTypeDialogComponent,
    AccountingComponent,
    ProjectDetailsDialogComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MaterialModule,
    FormsModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    LayoutModule,
    SharedModule,
    NgApexchartsModule,
    NgxPaginationModule,
    RichTextEditorModule,
  ],
  providers: [
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 5000, panelClass: 'snackbar-center' } },
  ]
})
export class AdminModule {
}
