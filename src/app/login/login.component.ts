import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { environment } from '../../environments/environment';
import { TdLoadingService } from '@covalent/core';
import { AuthStore } from '../../stores';
import { HttpErrorService } from '../../services';
import { SgNotificationService } from '../../components';
import { AuthFirebaseServiceProvider } from '../../services/firebase/auth-firebase-service-provider';
import { CallbackModel } from '../../models';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['../main/main.component.scss', './login.component.scss']
})
export class LoginComponent implements OnInit {

    appTitle: string = environment.appTitle;
    email: string;
    password: string;

    constructor(
        private _router: Router,
        private _titleService: Title,
        private _loadingService: TdLoadingService,
        private _notificationService: SgNotificationService,
        private _authStore: AuthStore,
        private _sgNotificationService: SgNotificationService,
        private authFirebaseService: AuthFirebaseServiceProvider,
        private _httpErrorService: HttpErrorService) {
        this.authFirebaseService.logout((e) => this.logoutCallback(e));
    }

    login(): void {
        this.authFirebaseService.loginWithEmailPassword(this.email, this.password, (e) => this.loginWithEmailPasswordCallback(e));
    }

    loginWithEmailPasswordCallback(callbackModel: CallbackModel) {
        if (callbackModel.success) {
            this._notificationService.displayMessage('Logged in successfully');
            localStorage.setItem('userKey', callbackModel.data.uid);
            this._router.navigate(['/']);
        } else {
            this._notificationService.displayMessage(callbackModel.data.message);
        }
    }

    ngOnInit(): void {
        localStorage.setItem('userKey', '');
        this.authFirebaseService.logout((e) => this.logoutCallback(e));
        this._titleService.setTitle(this.appTitle + ' | ' + 'Login');
    }

    logoutCallback(callbackModel: CallbackModel) {
        if (callbackModel.success) {
            this._notificationService.displayMessage('Logged out successfully');
            return;
        }
        this._notificationService.displayMessage('Logged in unsuccessfully');
    }
}
