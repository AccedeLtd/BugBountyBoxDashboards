import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AutoLoginPartialRoutesGuard } from 'angular-auth-oidc-client';
import { MainComponent } from './main/main.component';
import { AuthGuard } from './core/guards/auth.guard';
import { ProficiencyGuard } from './core/guards/proficiency.guard';
import { SettingsOnlyComponent } from './hacker/settings-only/settings.component';
import { includeAdmin, includeHacker, includeCustomer } from './config';

const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'settings', component: SettingsOnlyComponent },
];

if (includeAdmin) {
  routes.push({ 
    path: 'admin', 
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    canLoad: [AuthGuard.forRole('admin')],
  });
}

if (includeHacker) {
  routes.push({ 
    path: 'hacker', 
    loadChildren: () => import('./hacker/hacker.module').then(m => m.HackerModule),
    canLoad: [AuthGuard.forRole('hacker')],
    canActivate: [ProficiencyGuard],
  });
}

if (includeCustomer) {
  routes.push({ 
    path: 'customer', 
    loadChildren: () => import('./customer/customer.module').then(m => m.CustomerModule),
    canLoad: [AuthGuard.forRole('customer')],
  });
}

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
