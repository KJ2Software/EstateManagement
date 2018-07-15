import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { SgNotificationService } from '../components';
import { AuthStore } from '../stores/auth.store';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class RouteGuard implements CanActivate {
    constructor(private _router: Router,
        private _authStore: AuthStore,
        private _mdSnackBar: MatSnackBar) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)
        : boolean {

        if (localStorage.getItem('userKey') === undefined || localStorage.getItem('userKey') === ''
            || localStorage.getItem('userKey') === null) {
            this._mdSnackBar.open('Access Unauthorised!', 'Close', { duration: 5000, panelClass: ['bgc-red-700', 'text-white'] });
            this._authStore.logout();
            return false;
        }
        if (state.url === '/') {
            return true;
        }
        return true;
    }
}
