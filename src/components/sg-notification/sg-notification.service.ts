import { Injectable, Component } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { SgNotificationComponent } from './sg-notification.component';

@Injectable()
export class SgNotificationService {

    constructor(private _snackbar: MatSnackBar) {
    }

    displayError(msg: string) {
        this._snackbar.openFromComponent(SgNotificationComponent, {
            duration: 10000,
            data: {
                message: msg,
                icon: 'error',
                iconColor: 'error'
            }
        });
    }

    displayMessage(msg: string) {
        this._snackbar.openFromComponent(SgNotificationComponent, {
            duration: 5000,
            data: {
                message: msg,
                icon: 'info',
                iconColor: 'primary'
            }
        });
    }

    displaySuccess(msg: string) {
        this._snackbar.openFromComponent(SgNotificationComponent, {
            duration: 2500,
            data: {
                message: msg,
                icon: 'check_circle',
                iconColor: 'accent'
            }
        });
    }
}
