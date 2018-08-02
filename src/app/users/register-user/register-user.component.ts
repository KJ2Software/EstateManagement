import { Component, OnInit } from '@angular/core';
import { AuthFirebaseServiceProvider, UserFirebaseServiceProvider, EstateFirebaseServiceProvider } from '../../../services';
import { CallbackModel, UserModel, EstateModel } from '../../../models';
import { MatSnackBar } from '../../../../node_modules/@angular/material';
import { FormBuilder, FormGroup, Validators } from '../../../../node_modules/@angular/forms';
import { ActivatedRoute, Router } from '../../../../node_modules/@angular/router';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.scss']
})
export class RegisterUserComponent implements OnInit {
  private subscriptions: any[] = [];
  private estateKey: string = '';
  public userKey: string = '';
  public userModel: UserModel = new UserModel();
  public password: string = '';

  frmUser: FormGroup;

  constructor(private _snackBarService: MatSnackBar, private _router: Router,
    private estateFirebaseService: EstateFirebaseServiceProvider, public builder: FormBuilder,
    private _activatedRoute: ActivatedRoute, private userFirebaseService: UserFirebaseServiceProvider,
    private authFirebaseService: AuthFirebaseServiceProvider) {
    this.frmUser = builder.group({
      'email': [{ value: '' }, Validators.required],
      'isAdmin': [{ value: '' }],
      'name': [{ value: '' }, Validators.required],
      'surname': [{ value: '' }, Validators.required]
      // 'password': [{ value: '' }, Validators.required]
    });

    this.estateKey = localStorage.getItem('estateKey');
  }

  ngOnInit() {

    this.subscriptions.push(this._activatedRoute.params.subscribe((params) => {
      /* tslint:disable:no-string-literal */
      this.userKey = params['userKey'];
      if (this.userKey === '0') {
        this.userKey = '';
      }

      this.loadData();
    }));
  }

  canSave() {
    if (!this.frmUser.valid) {
      return false;
    }

    if (this.userKey === '' && this.password === '') {
      return false;
    }

    return true;
  }

  loadData() {
    if (this.userKey === '') {
      this.userModel = new UserModel();
      this.userModel.isAdmin = false;
      this.frmUser.reset(this.userModel);
      return;
    }
    this.userFirebaseService.getRecord(this.userKey, (e) => this.getRecordCallback(e));

  }

  getRecordCallback(callback: CallbackModel) {
    if (callback.success) {
      this.userModel = callback.data;
      this.frmUser.reset(this.userModel);
      return;
    }

    this._snackBarService.open('Error getting user', '', {
      duration: 2000
    });
  }

  saveClick() {

    if (this.userKey === '') {
      // Add new
      this.authFirebaseService.createUserWithEmailPassword(this.frmUser.value.email, this.password,
        (e) => this.createFirebaseUserCallback(e));
      return;
    }

    // Update
    let myEstateKey = this.estateKey;
    if (this.frmUser.value.isAdmin) {
      myEstateKey = '';
    }

    let userModel: UserModel = {
      key: this.userKey,
      email: this.frmUser.value.email,
      estateKey: myEstateKey,
      isAdmin: this.frmUser.value.isAdmin,
      name: this.frmUser.value.name,
      surname: this.frmUser.value.surname,
      unitKey: ''
    };
    this.userFirebaseService.insertRecord(userModel, (e) => this.insertUserCallback(e));
  }

  createFirebaseUserCallback(callback: CallbackModel) {
    if (!callback.success) {
      this._snackBarService.open('Something went wrong registering you!', '', {
        duration: 2000
      });
      return;
    }

    let myEstateKey = this.estateKey;
    if (this.frmUser.value.isAdmin) {
      myEstateKey = '';
    }

    let userModel: UserModel = {
      key: callback.data.uid,
      email: this.frmUser.value.email,
      estateKey: myEstateKey,
      isAdmin: this.frmUser.value.isAdmin,
      name: this.frmUser.value.name,
      surname: this.frmUser.value.surname,
      unitKey: ''
    };

    this.userFirebaseService.insertRecord(userModel, (e) => this.insertUserCallback(e));
  }

  insertUserCallback(callback: CallbackModel) {
    if (!callback.success) {
      this._snackBarService.open('Something went wrong registering you! Please contact your Administrator', '', {
        duration: 2000
      });
      return;
    }

    this._snackBarService.open('Registartion completed', '', {
      duration: 2000
    });

    this.cancelClick();
  }

  cancelClick() {
    this._router.navigate(['/users']);

  }

}
