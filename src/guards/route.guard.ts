import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { SgNotificationService } from '../components';
import { AuthStore } from '../stores/auth.store';

@Injectable()
export class RouteGuard implements CanActivate {
    constructor(private _router: Router, private _authStore: AuthStore, private _sgNotificationService: SgNotificationService) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        let roles: string[] = route.data.roles;
        if (!this._authStore.hasValidToken()) {
            this._sgNotificationService.displayError('Session Expired! Please Login Again.');
            this._authStore.logout();
            return false;
        }

        if (this._authStore.hasRoles(roles)) {
            return true;
        }

        this._sgNotificationService.displayError('Access Unauthorised!');
        this._authStore.logout();
        return false;
    }
}
