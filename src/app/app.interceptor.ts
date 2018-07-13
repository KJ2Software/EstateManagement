import { Injectable } from '@angular/core';
import { RequestOptionsArgs, Headers } from '@angular/http';
import { IHttpInterceptor } from '@covalent/http';
import { SgNotificationService } from '../components';
import { AuthStore } from '../stores';

@Injectable()
export class RequestInterceptor implements IHttpInterceptor {

    token: string;

    constructor(
        private _authStore: AuthStore,
        private _sgNotificationService: SgNotificationService
    ) {
        this._authStore.token.subscribe((token) => {
            this.token = 'bearer ' + token.result;
        });
    }

    onRequest(requestOptions: RequestOptionsArgs): RequestOptionsArgs {

        let headers: Headers = new Headers();

        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        headers.append('Authorization', this.token);

        requestOptions.headers = headers;

        // Domain Authentication
        // requestOptions.withCredentials = true;

        return requestOptions;
    }

    onResponseError(error) {

        if (error.status === 403) {
            this._sgNotificationService.displayError('Unauthorized');
            this._authStore.logout();
        }
        return error;
    }
}
