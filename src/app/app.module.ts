import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { AppRoutingModule } from './app-routing.module';
import { LoadingComponent } from './components/loading/loading.component';
import { LayoutModule } from '@angular/cdk/layout';
import {
  AuthInterceptor,
  AuthModule,
  LogLevel,
} from 'angular-auth-oidc-client';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MainComponent } from './main/main.component';
import { ToastrModule } from 'ngx-toastr';
import { NgxPayPalModule } from 'ngx-paypal';
import {
  MatDialogRef,
  MAT_DIALOG_DEFAULT_OPTIONS,
} from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { SettingsNavComponent } from './components/settings-nav/settings-nav.component';
import { SettingsOnlyComponent } from './hacker/settings-only/settings.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaymentMethodDialogComponent } from './hacker/settings-only/payment-method-dialog/payment-method-dialog.component';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    LoadingComponent,
    SettingsNavComponent,
    SettingsOnlyComponent,
    PaymentMethodDialogComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    AppRoutingModule,
    LayoutModule,
    ToastrModule.forRoot(),
    AuthModule.forRoot({
      config: [
        {
          configId: 'hacker',
          authority: environment.authority,
          redirectUrl: window.location.origin,
          postLogoutRedirectUri: window.location.origin,
          clientId: 'bounty_box_hacker_client',
          scope:
            'openid profile email offline_access bug_bounty_customer_api bug_bounty_hacker_api bug_bounty_hacker_dashboard_api_gateway bug_bounty_identity_server_api bug_bounty_notification_api bug_bounty_project_api bug_bounty_wallet_api hacker_permissions user_permissions',
          responseType: 'code',
          silentRenew: true,
          useRefreshToken: true,
          logLevel: environment.production ? LogLevel.None : LogLevel.Debug,
          unauthorizedRoute: window.location.origin,
          secureRoutes: [
            environment.hackerPortalApiUrl,
            environment.projectServiceApiUrl,
          ],
        },
        {
          configId: 'admin',
          authority: environment.authority,
          redirectUrl: window.location.origin,
          postLogoutRedirectUri: window.location.origin,
          clientId: 'bounty_box_admin_client',
          scope:
            'openid profile email offline_access bug_bounty_admin_api bug_bounty_customer_api bug_bounty_hacker_api bug_bounty_admin_dashboard_api_gateway bug_bounty_identity_server_api bug_bounty_notification_api bug_bounty_project_api bug_bounty_wallet_api admin_permissions user_permissions',
          responseType: 'code',
          silentRenew: true,
          useRefreshToken: true,
          logLevel: environment.production ? LogLevel.None : LogLevel.Debug,
          unauthorizedRoute: window.location.origin,
          secureRoutes: [
            environment.adminPortalApiUrl,
            environment.projectServiceApiUrl,
          ],
        },
        {
          configId: 'customer',
          authority: environment.authority,
          redirectUrl: window.location.origin,
          postLogoutRedirectUri: window.location.origin,
          clientId: 'bounty_box_customer_client',
          scope:
            'openid profile email offline_access bug_bounty_customer_api bug_bounty_hacker_api bug_bounty_customer_dashboard_api_gateway bug_bounty_identity_server_api bug_bounty_notification_api bug_bounty_project_api bug_bounty_wallet_api customer_permissions user_permissions',
          responseType: 'code',
          silentRenew: true,
          useRefreshToken: true,
          logLevel: environment.production ? LogLevel.None : LogLevel.Debug,
          unauthorizedRoute: window.location.origin,
          secureRoutes: [
            environment.customerPortalApiUrl,
            environment.projectServiceApiUrl,
          ],
        },
      ],
    }),
    HttpClientModule,
    NgxPayPalModule,
    SharedModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: true } },
    { provide: MatDialogRef, useValue: {} },
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: { duration: 5000, panelClass: 'snackbar-center' },
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
