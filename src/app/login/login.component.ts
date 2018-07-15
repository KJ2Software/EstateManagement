import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { environment } from '../../environments/environment';
import { TdLoadingService, TdDialogService } from '@covalent/core';
import { AuthStore } from '../../stores';
import { HttpErrorService, AuthFirebaseServiceProvider, UserFirebaseServiceProvider, EstateFirebaseServiceProvider } from '../../services';
import { SgNotificationService } from '../../components';
import { CallbackModel } from '../../models';
import { EstateDialogComponent } from '../estate-dialog/estate-dialog.component';
import { MatDialog, MatDialogConfig } from '../../../node_modules/@angular/material';

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
        private _dialogService: TdDialogService, public dialog: MatDialog,
        private _router: Router,
        private _titleService: Title,
        private _loadingService: TdLoadingService,
        private _notificationService: SgNotificationService,
        private _authStore: AuthStore,
        private _sgNotificationService: SgNotificationService,
        private authFirebaseService: AuthFirebaseServiceProvider,
        private userService: UserFirebaseServiceProvider,
        private estateService: EstateFirebaseServiceProvider,
        private _httpErrorService: HttpErrorService) {
        this.authFirebaseService.logout((e) => this.logoutCallback(e));

        this.email = 'kj2software@gmail.com';
        this.password = 'Admin@123';
    }

    login(): void {
        this.authFirebaseService.loginWithEmailPassword(this.email, this.password, (e) => this.loginWithEmailPasswordCallback(e));

    }

    loginWithEmailPasswordCallback(callbackModel: CallbackModel) {
        if (callbackModel.success) {
            this._notificationService.displayMessage('Logged in successfully');
            this.getUser(callbackModel.data.uid);

        } else {
            this._notificationService.displayMessage(callbackModel.data.message);
        }
    }

    getUser(userKey: string) {
        this.userService.getRecord(userKey, (e) => this.getUserCallback(e));
    }

    getUserCallback(callbackModel: CallbackModel) {
        if (callbackModel.success) {
            localStorage.setItem('userKey', callbackModel.data.key);
            localStorage.setItem('estateKey', callbackModel.data.estateKey);
            localStorage.setItem('isAdmin', callbackModel.data.isAdmin);
            if (!callbackModel.data.isAdmin) {
                this._router.navigate(['/']);
                return;
            }
            this.showEstateDialog();
        } else {
            this._notificationService.displayMessage(callbackModel.data.message);
        }
    }

    showEstateDialog() {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.width = '500px';
        dialogConfig.data = '';

        let dialogRef = this.dialog.open(EstateDialogComponent, dialogConfig);
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                localStorage.setItem('estateKey', result);
                this._router.navigate(['/']);
            }
        });
    }

    ngOnInit(): void {
        localStorage.setItem('userKey', '');
        this.authFirebaseService.logout((e) => this.logoutCallback(e));
        this._titleService.setTitle(this.appTitle + ' | ' + 'Login');
    }

    logoutCallback(callbackModel: CallbackModel) {
        if (callbackModel.success) {
            localStorage.removeItem('userKey');
            localStorage.removeItem('estateKey');
            localStorage.removeItem('isAdmin');
            this._notificationService.displayMessage('Logged out successfully');
            return;
        }
        this._notificationService.displayMessage('Logged in unsuccessfully');
    }
}
