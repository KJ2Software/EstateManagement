import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';
import { Http, Response } from '@angular/http';
import { RequestOptionsArgs, Headers } from '@angular/http';
import { IHttpInterceptor } from '@covalent/http';
import { SgNotificationService } from '../components';

@Injectable()
export class HttpErrorService {
    private outputMessage: string;

    constructor(
        public http: Http,
        private _router: Router,
        private _notificationService: SgNotificationService
    ) {}

    convertObject(error: string): any {
        return JSON.parse(error);
    }

    handle400(error: any) {
        try {
            let errorRes = JSON.parse(error._body);

            if (typeof errorRes === 'string' || errorRes instanceof String) {
                if (error._body === '"Invalid Credentials"') {
                    this.outputMessage = 'Invalid user name or password';
                } else {
                    this.outputMessage = error._body;
                    this.outputMessage = this.outputMessage.replace(/^"(.*)"$/, '$1');
                }
            } else {
                if (errorRes.Violations && errorRes.Violations.length > 0) {
                    this.outputMessage = 'Policy Error: ';
                    errorRes.Violations.forEach((violation) => {
                        this.outputMessage += violation.Value + '. ';
                    });
                } else {
                    this.outputMessage = 'Validation Error: ';
                    for (let prop in errorRes) {
                        this.outputMessage += errorRes[prop] + ' ';
                    }
                }
            }
        } catch (exception) {
            this.outputMessage = error._body;
        }
    }

    handleHttpError(error: any, resourceName?: string): string {
        this.outputMessage = '';
        if (error.status === 401) {
            this.clearToken();
            this._router.navigate(['/login']);
        } else if (error.status === 0) {
            this.outputMessage = 'Connection Error / Server Unavailable';
        } else if (error.status === 404) {
            this.outputMessage = (resourceName ? resourceName : 'Resource') + ' cannot be found or is not linked to this account.';
        } else if (error.status === 403) {
            this.outputMessage = 'You are not authorised to perform this action.';
        } else if (error.status >= 500) {
            this.outputMessage = 'The server encountered an error or is unavailable. Please try again later.';
        } else if (error.status === 400) {
            this.handle400(error);
        } else {
            this.outputMessage = 'Unexpected server error';
        }

        this._notificationService.displayError(this.outputMessage);
        return this.outputMessage;
    }

    private clearToken() {
        localStorage.setItem('token', undefined);
        localStorage.setItem('expiresIn', undefined);
        localStorage.setItem('isAuth', 'false');
    }
}
