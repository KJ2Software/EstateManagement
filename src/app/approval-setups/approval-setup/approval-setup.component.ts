import { Component, OnInit } from '@angular/core';
import { TdDialogService } from '../../../../node_modules/@covalent/core';
import { MatSnackBar } from '../../../../node_modules/@angular/material';
import { Router, ActivatedRoute } from '../../../../node_modules/@angular/router';
import { FormBuilder, FormGroup, Validators } from '../../../../node_modules/@angular/forms';
import { ApprovalSetupFirebaseServiceProvider, ApprovalTypeFirebaseServiceProvider,
  UserFirebaseServiceProvider, CommonService } from '../../../services';
import { CallbackModel, ApprovalSetupModel, UserModel, ApprovalTypeModel } from '../../../models';

@Component({
  selector: 'app-approval-setup',
  templateUrl: './approval-setup.component.html',
  styleUrls: ['./approval-setup.component.scss']
})
export class ApprovalSetupComponent implements OnInit {
  private approvalSetupKey: string;
  private subscriptions: any[] = [];
  private approvalSetupModel: ApprovalSetupModel = new ApprovalSetupModel();
  private estateKey: string = '';
  private users: UserModel[] = [];
  private approvalTypes: ApprovalTypeModel[] = [];

  frmApprovalSetup: FormGroup;

  constructor(private _dialogService: TdDialogService, private _snackBarService: MatSnackBar, private _router: Router,
    private commonService: CommonService, private _activatedRoute: ActivatedRoute, public builder: FormBuilder,
    private approvalSetupService: ApprovalSetupFirebaseServiceProvider,
    private userSetupService: UserFirebaseServiceProvider, private approvalTypeService: ApprovalTypeFirebaseServiceProvider) {
    this.frmApprovalSetup = builder.group({
      'approvalTypeKey': [{ value: '' }, Validators.required],
      'userKey': [{ value: '' }, Validators.required]
    });

    this.estateKey = localStorage.getItem('estateKey');

  }

  ngOnInit(): void {
    this.subscriptions.push(this._activatedRoute.params.subscribe((params) => {
      /* tslint:disable:no-string-literal */
      this.approvalSetupKey = params['approvalSetupKey'];
      if (this.approvalSetupKey === '0') {
        this.approvalSetupKey = '';
      }
      this.loadData();
    }));
  }

  loadData() {

    this.approvalTypeService.getAll(this.estateKey, (e) => this.getApprovalTypesCallback(e));
    this.userSetupService.getAll(this.estateKey, (e) => this.getUsersCallback(e));

    if (this.approvalSetupKey === '') {
      this.approvalSetupModel = new ApprovalSetupModel();
      this.frmApprovalSetup.reset(this.approvalSetupModel);
      return;
    }
    this.approvalSetupService.getRecord(this.approvalSetupKey, (e) => this.getRecordCallback(e));

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

  getRecordCallback(callback: CallbackModel) {
    if (callback.success) {
      this.approvalSetupModel = callback.data;
      this.frmApprovalSetup.reset(this.approvalSetupModel);
      return;
    }

    this._snackBarService.open('Error getting approval setup', '', {
      duration: 2000
    });
  }

  saveClick(frmCmps) {

    if (this.approvalSetupKey === '') {
      // Add
      let modelToSave: ApprovalSetupModel = {
        key: this.commonService.getNewGuid(),
        estateKey: localStorage.getItem('estateKey'),
        approvalTypeKey: this.frmApprovalSetup.value.approvalTypeKey,
        userKey: this.frmApprovalSetup.value.userKey,
        sequence: 0
      };

      this.approvalSetupService.insertRecord(modelToSave, (e) => this.insertUpdateRecord(e));
      this._router.navigate(['/approval-setups']);
    } else {
      // Update
      let modelToSave: ApprovalSetupModel = {
        key: this.approvalSetupKey,
        estateKey: localStorage.getItem('estateKey'),
        approvalTypeKey: this.frmApprovalSetup.value.approvalTypeKey,
        userKey: this.frmApprovalSetup.value.userKey,
        sequence: 0
      };

      this.approvalSetupService.updateRecord(modelToSave, (e) => this.insertUpdateRecord(e));
      this._router.navigate(['/approval-setups']);
    }
  }

  cancelClick() {
    this._router.navigate(['/approval-setups']);

  }
  insertUpdateRecord(callback: CallbackModel) {
    if (callback.success) {
      this._snackBarService.open('Execute successfull', undefined, { duration: 3000 });

      return;
    }
    this._snackBarService.open('Execute failed', undefined, { duration: 3000 });
  }

}
