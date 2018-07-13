import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { SgNotificationService } from '../../components';
import { TdLoadingService } from '@covalent/core';

import { environment } from '../../environments/environment';
import { UserModel, PasswordResetRequestModel, ResetPasswordModel } from '../../models';
import { HttpErrorService } from '../../services';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  userId: string = '';
  token: string = '';
  subscription: any;
  password: string = '';
  confirmPassword: string = '';
  loading: boolean = false;
  appTitle: string = environment.appTitle;

  constructor(
    private route: ActivatedRoute,
    private _router: Router,
    private _titleService: Title,
    private _loadingService: TdLoadingService,
    private _sgNotificationService: SgNotificationService,
    private _httpErrorService: HttpErrorService,
    private _usersService: UsersService) { }

  ngOnInit() {
    this.subscription = this.route.params.subscribe((params) => {
      this.userId = params.userId;
      this.token = params.token;
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = undefined;
    }
  }

  submit(): void {
    if (!this.token || !this.userId) {
      this._sgNotificationService.displayMessage('Invalid Password Reset URL - Token/UserID is missing!');
      return;
    }

    if (!this.password || !this.confirmPassword) {
      this._sgNotificationService.displayMessage('Password and Confirm Password are required!');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this._sgNotificationService.displayMessage('Password and Confirm Password are not the same!');
      return;
    }

    this._loadingService.register('reset-password');
    this.loading = true;

    this._usersService.resetPassword({ token: this.token, password: this.password, userId: this.userId }).subscribe(
      (response) => {
        this._loadingService.resolve('reset-password');
        this.loading = false;
        this._sgNotificationService.displayMessage(
          'Password has been successfully reset for account ' + response.username + '.'
        );
      },
      (error) => {
        this._loadingService.resolve('reset-password');
        this.loading = false;
        this._httpErrorService.handleHttpError(error);
      }
    );
  }

  back() {
    this._router.navigate(['/login']);
  }
}
