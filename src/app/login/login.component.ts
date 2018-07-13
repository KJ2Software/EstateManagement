import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { environment } from '../../environments/environment';
import { TdLoadingService } from '@covalent/core';
import { AuthStore } from '../../stores';
import { HttpErrorService } from '../../services';
import { SgNotificationService } from '../../components';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['../main/main.component.scss', './login.component.scss']
})
export class LoginComponent implements OnInit {

    appTitle: string = environment.appTitle;
    username: string;
    password: string;

    constructor(
        private _router: Router,
        private _titleService: Title,
        private _loadingService: TdLoadingService,
        private _notificationService: SgNotificationService,
        private _authStore: AuthStore,
        private _sgNotificationService: SgNotificationService,
        private _httpErrorService: HttpErrorService) {
    }

    login(): void {

        this._loadingService.register();

        this._authStore.login({ userName: this.username, password: this.password }).subscribe(
            (token) => {
                this._router.navigate(['/']);
                this._loadingService.resolve();
                this._notificationService.displayMessage('Welcome back ' + (token.firstName ? token.firstName : token.username) + '!');
            },
            (error) => {
                this._loadingService.resolve();
                let errorMessage = this._httpErrorService.handleHttpError(error);
            }
        );
    }

    forgotPassword() {
        this._router.navigate(['/forgot-password']);
    }

    ngOnInit(): void {
        this._titleService.setTitle(this.appTitle + ' | ' + 'Login');
    }
}
