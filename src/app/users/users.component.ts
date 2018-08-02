import { Component, OnInit } from '@angular/core';
import { UserFirebaseServiceProvider } from '../../services';
import { CallbackModel, UserModel } from '../../models';
import { MatSnackBar } from '../../../node_modules/@angular/material';
import { Router } from '../../../node_modules/@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  users: UserModel[] = [];

  constructor(private _snackBarService: MatSnackBar, private _router: Router,
    private userFirebaseServiceProvider: UserFirebaseServiceProvider) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    let estateKey = localStorage.getItem('estateKey');
    this.userFirebaseServiceProvider.getAll(estateKey, (e) => this.getAllForEstateCallback(e));
  }

  getAllForEstateCallback(callbackModel: CallbackModel) {
    this.users = [];
    if (callbackModel.success) {
      this.users = callbackModel.data;
      return;
    }

    this._snackBarService.open('Error getting users', '', {
      duration: 2000
    });
  }

  detailClick(userModel: UserModel) {
    this._router.navigate(['/users/' + userModel.key]);
  }

}
