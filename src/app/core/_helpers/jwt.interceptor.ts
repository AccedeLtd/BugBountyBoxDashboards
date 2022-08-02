import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { OidcSecurityService } from 'angular-auth-oidc-client';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(
    public oidcSecurityService: OidcSecurityService
  ) {
    
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.oidcSecurityService.getAccessToken();
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next.handle(request);
  }
}
