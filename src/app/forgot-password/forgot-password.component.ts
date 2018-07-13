import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { environment } from '../../environments/environment';
import { SgNotificationService } from '../../components';
import { TdLoadingService } from '@covalent/core';
import { HttpErrorService } from '../../services';
import { Router } from '@angular/router';
import {
    UserModel,
    PasswordResetRequestModel,
    ResetPasswordModel
} from '../../models';
import { UsersService } from '../../services/users.service';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
    appTitle: string = environment.appTitle;
    username: string;
    loading: boolean = false;

    constructor(
        private _router: Router,
        private _titleService: Title,
        private _loadingService: TdLoadingService,
        private _sgNotificationService: SgNotificationService,
        private _httpErrorService: HttpErrorService,
        private _usersService: UsersService
    ) {}

    submit(): void {
        this._loadingService.register('forgot-password');
        this.loading = true;

        this._usersService
            .requestPasswordReset({ username: this.username })
            .subscribe(
                (response) => {
                    this._loadingService.resolve('forgot-password');
                    this.loading = false;
                    this._sgNotificationService.displayMessage(
                        'An email has been sent to ' +
                            response.emailAddress +
                            ' with details for resetting your password.'
                    );
                },
                (error) => {
                    this._loadingService.resolve('forgot-password');
                    this.loading = false;
                    this._httpErrorService.handleHttpError(error);
                }
            );
    }

    back() {
        this._router.navigate(['/login']);
    }

    ngOnInit() {
        this._titleService.setTitle(this.appTitle + ' | ' + 'Forgot Password');
    }
}
