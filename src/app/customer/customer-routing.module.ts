import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BountyActivityDetailComponent } from './bounty-activity/bounty-activity-detail.component';
import { BountyActivityComponent } from './bounty-activity/bounty-activity.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PaymentDetailsComponent } from './payments/payment-details.component';
import { PaymentsComponent } from './payments/payments.component';
import { ProjectsComponent } from './projects/projects.component';
import { ProjectDetailComponent } from './projects/project-detail.component';
import { SettingsComponent } from './settings/settings.component';
import { HackersComponent } from './hackers/hackers.component';
import { TransfersComponent } from './transfers/transfers.component';
import { HackersDetailComponent } from './hackers/hackers-detail.component';
import { AccountingComponent } from './accounting/accounting.component';
import { NewProjectComponent } from './new-project/new-project.component';
import { UpdateDraftProjectComponent } from './projects/update-draft-project/update-draft-project.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: DashboardComponent },
      { path: 'new-project', component: NewProjectComponent },
      { path: 'projects', component: ProjectsComponent },
      { path: 'projects/details/:id', component: ProjectDetailComponent },  
      { path:'projects/update-project/:id',component:UpdateDraftProjectComponent},
      { path: 'incoming', component: BountyActivityComponent },
      { path: 'incoming/:id', component: BountyActivityDetailComponent },
      { path: 'payments', component: PaymentsComponent },
      { path: 'payments/details', component: PaymentDetailsComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'hackers', component: HackersComponent },
      { path: 'hackers/details', component: HackersDetailComponent },
      { path: 'payments/transfers', component: TransfersComponent },
      { path: 'payments/accounting', component: AccountingComponent },
      { path: '', redirectTo: '', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }
