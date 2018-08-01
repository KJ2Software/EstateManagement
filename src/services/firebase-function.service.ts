import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptionsArgs } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class FirebaseFunctionService {

    constructor(private _http: Http) {
    }

    helloWorld(): Observable<any> {
        let header = new Headers();
        header.append('content-Type', 'application/json');

        return this._http
            .post('https://us-central1-kj2-estate-management.cloudfunctions.net/helloWorld', undefined, { headers: header })
            .map((res) => {
                return res;
            })
            .catch((error: any) => Observable.throw(error) || 'Server error');

    }
}
