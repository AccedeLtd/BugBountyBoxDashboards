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
import { AccountingComponent } from './accounting/accounting.component';
import { TasksComponent } from './tasks/tasks.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: DashboardComponent },
      { path: 'projects', component: ProjectsComponent },
      { path: 'projects/details/:id', component: ProjectDetailComponent },
      { path: 'tasks', component: TasksComponent },
      { path: 'bounty-activity', component: BountyActivityComponent },
      { path: 'bounty-activity/details/:id', component: BountyActivityDetailComponent },
      { path: 'payments', component: PaymentsComponent },
      { path: 'payments/details', component: PaymentDetailsComponent },
      { path: 'payments/accounting', component: AccountingComponent },
      { path: 'settings', component: SettingsComponent },
      { path: '', redirectTo: '', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HackerRoutingModule { }
