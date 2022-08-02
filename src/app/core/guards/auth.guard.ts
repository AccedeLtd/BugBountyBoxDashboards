import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
  UrlTree,
} from '@angular/router';
import { map, Observable, take } from 'rxjs';
import { OidcSecurityService } from 'angular-auth-oidc-client';

export type AuthRole = 'hacker' | 'admin' | 'customer';

export class AuthGuard {
  static forRole(role: AuthRole) {
    @Injectable({ providedIn: 'root' })
    class Guard implements CanLoad, CanActivate {
      constructor(
        private readonly router: Router,
        private readonly securityService: OidcSecurityService
      ) {}

      canLoad(
        route: Route,
        segments: UrlSegment[]
      ): Observable<boolean | UrlTree> {
        return this.checkAuth(route);
      }

      canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
      ): Observable<boolean | UrlTree> {
        return this.checkAuth(route, state.url);
      }

      canActivateChild(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
      ): Observable<boolean | UrlTree> {
        return this.checkAuth(route, state.url);
      }

      private checkAuth(
        route: Route | ActivatedRouteSnapshot,
        url?: string
      ): Observable<boolean> {
        const configId = role;

        return this.securityService.checkAuth(url, configId).pipe(
          take(1),
          map(({ isAuthenticated }) => {
            if (isAuthenticated) {
              this.checkSavedRedirectRouteAndNavigate(configId);
            } else {
              if (url) this.saveRedirectRoute(configId, url);
              this.securityService.authorize(configId);
            }

            return isAuthenticated;
          })
        );
      }

      private getRedirectStorageKey(configId?: string) {
        return `${configId || 'default'}_redirect`;
      }

      private saveRedirectRoute(configId: string | undefined, url: string) {
        sessionStorage.setItem(this.getRedirectStorageKey(configId), url);
      }

      private checkSavedRedirectRouteAndNavigate(configId?: string) {
        const redirectStorageKey = this.getRedirectStorageKey(configId);
        const redirectUrl = sessionStorage.getItem(redirectStorageKey);
        if (redirectUrl) {
          sessionStorage.removeItem(redirectStorageKey);
          this.router.navigateByUrl(redirectUrl);
        }
      }
    }

    return Guard;
  }
}
