import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { OidcSecurityService } from "angular-auth-oidc-client";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { EncodeService } from "../_services/encode.service";
import { constants } from "../_utils/const";

@Injectable({ providedIn: 'root' })
export class ProficiencyGuard implements CanActivate {
    constructor(
        private router: Router,
        private encodeService: EncodeService,
        private oidcSecurityService: OidcSecurityService,
    ) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        let decodedData = null;
        const me = localStorage.getItem(environment.me);
        if (me) decodedData = this.encodeService.decode(me);

        if (decodedData) {
            const user = JSON.parse(decodedData);
            const authUser = this.oidcSecurityService.getUserData('hacker');
            // check if user is a hacker and has proficiency
            if (authUser.role == constants.HACKER && user.proficiencyLevels.length == 0) {
                this.router.navigate(['settings']);
            }
            return true;
        } else {
            return true;
        }
    }
}