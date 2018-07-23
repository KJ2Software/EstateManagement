import { Component, OnInit } from '@angular/core';
import { Http, Headers, Response, URLSearchParams, RequestOptionsArgs } from '@angular/http';
import { Validators, FormGroup, FormBuilder } from '../../../node_modules/@angular/forms';
import { TdDialogService } from '../../../node_modules/@covalent/core';
import { ActivatedRoute, Router } from '../../../node_modules/@angular/router';
import {
  ApprovalSetupFirebaseServiceProvider, UserFirebaseServiceProvider,
  ApprovalTypeFirebaseServiceProvider, CommonService
} from '../../services';
import { MatSnackBar } from '../../../node_modules/@angular/material';
import { UserModel, ApprovalTypeModel, CallbackModel, ApprovalModel } from '../../models';

@Component({
  selector: 'app-create-approval',
  templateUrl: './create-approval.component.html',
  styleUrls: ['./create-approval.component.scss']
})
export class CreateApprovalComponent implements OnInit {
  private subscriptions: any[] = [];
  private estateKey: string = '';
  private users: UserModel[] = [];
  private approvalTypes: ApprovalTypeModel[] = [];
  private approvalModel = new ApprovalModel();

  frmCreateApproval: FormGroup;

  constructor(private http: Http,
    private commonService: CommonService, private _dialogService: TdDialogService,
    private _snackBarService: MatSnackBar, private _router: Router,
    private _activatedRoute: ActivatedRoute, public builder: FormBuilder,
    private approvalSetupService: ApprovalSetupFirebaseServiceProvider,
    private userSetupService: UserFirebaseServiceProvider, private approvalTypeService: ApprovalTypeFirebaseServiceProvider) {
    this.frmCreateApproval = builder.group({
      'approvalTypeKey': [{ value: '' }, Validators.required],
      'notes': [{ value: '' }, Validators.required]
    });

    this.estateKey = localStorage.getItem('estateKey');
  }

  ngOnInit() {
    this.loadData();
    this.approvalModel = new ApprovalModel();
    this.frmCreateApproval.reset(this.approvalModel);
  }
  loadData() {
    this.approvalTypeService.getAll(this.estateKey, (e) => this.getApprovalTypesCallback(e));
    this.userSetupService.getAll(this.estateKey, (e) => this.getUsersCallback(e));
  }

  getApprovalTypesCallback(callback: CallbackModel) {
    if (callback.success) {
      this.approvalTypes = callback.data;
      return;
    }
    this._snackBarService.open('Error getting approval types', '', {
      duration: 2000
    });
  }

  getUsersCallback(callback: CallbackModel) {
    if (callback.success) {
      this.users = callback.data;

      return;
    }
    this._snackBarService.open('Error getting users', '', {
      duration: 2000
    });
  }

  saveClick(frmCmps) {
  }

}
