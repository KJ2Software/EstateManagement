import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptionsArgs } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class SendgridService {

    constructor(private _http: Http) {
    }


    sendMail(): Observable<any> {
        let data = { 'to': 'jacobusjonker@gmail.com', 'from': 'kj2software@gmail.com', 'subject': 'Hello from Sendgrid!', 'content': 'Hello World!' };

        let header = new Headers();
        header.append('content-Type', 'application/json');

        return this._http
            .post('https://us-central1-kj2-estate-management.cloudfunctions.net/httpEmail', data, { headers: header })
            .map((res) => {
                console.log(res);
                return res;
            })
            .catch((error: any) => Observable.throw(error) || 'Server error');

    }


    sendMail1(): Observable<any> {
        let data = { 'to': 'jacobusjonker@gmail.com', 'from': 'kj2software@gmail.com', 'subject': 'Hello from Sendgrid!', 'content': 'Hello World!' };

        let header = new Headers();
        header.append('content-Type', 'application/json');

        return this._http
            .post('https://us-central1-kj2-estate-management.cloudfunctions.net/sendEmail', data, { headers: header })
            .map((res) => {
                console.log(res);
                return res;
            })
            .catch((error: any) => Observable.throw(error) || 'Server error');

    }


    // sendMail(): Observable<any> {
    //     let data = {
    //         'personalizations': [{ 'to': [{ 'email': 'jacobusjonker@gmail.com' }] }],
    //         'from': { 'email': 'kjsoftware@gmail.com' },
    //         'subject': 'Sending with SendGrid is Fun',
    //         'content': [
    //             {
    //                 'type': 'text/plain',
    //                 'value': 'and easy to do anywhere, even with cURL'
    //             }
    //         ]
    //     };

    //     let header = new Headers();
    //     let token = 'Bearer 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';
    //     header.append('authorization', token);
    //     header.append('content-Type', 'application/json');
    //     header.append('Access-Control-Allow-Headers', 'Content-Type');
    //     header.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    //     header.append('Access-Control-Allow-Origin', '*');

    //     return this._http
    //         .post('https://api.sendgrid.com/v3/mail/send', data, { headers: header })
    //         .map((res) => {
    //             console.log(res);
    //             return res;
    //         })
    //         .catch((error: any) => Observable.throw(error) || 'Server error')
    //         .share();
    // }

}
