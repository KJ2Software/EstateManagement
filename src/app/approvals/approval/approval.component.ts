import { Component, OnInit } from '@angular/core';
import { ApprovalModel, CallbackModel, ApprovalTypeModel } from '../../../models';
import { FormGroup, FormBuilder, Validators } from '../../../../node_modules/@angular/forms';
import { TdDialogService } from '../../../../node_modules/@covalent/core';
import { ActivatedRoute, Router } from '../../../../node_modules/@angular/router';
import { ApprovalFirebaseServiceProvider, CommonService, ApprovalTypeFirebaseServiceProvider } from '../../../services';
import { MatSnackBar } from '../../../../node_modules/@angular/material';
import { NullTemplateVisitor } from '../../../../node_modules/@angular/compiler';

@Component({
  selector: 'app-approval',
  templateUrl: './approval.component.html',
  styleUrls: ['./approval.component.scss']
})
export class ApprovalComponent implements OnInit {
  private estateKey: string;
  private approvalKey: string;
  private subscriptions: any[] = [];
  public approvalTypeKey: string;
  public approvalModel: ApprovalModel = new ApprovalModel();
  public approvalTypes: ApprovalTypeModel[] = [];
  frmApproval: FormGroup;

  constructor(private _dialogService: TdDialogService, private _snackBarService: MatSnackBar, private _router: Router,
    private _activatedRoute: ActivatedRoute, public builder: FormBuilder,
    private approvalService: ApprovalFirebaseServiceProvider,
    private approvalTypeService: ApprovalTypeFirebaseServiceProvider,
    private commonSerivce: CommonService) {
    this.frmApproval = builder.group({
      'approvalTypeKey': [{ value: '' }, Validators.required],
      'description': [{ value: '' }, Validators.required]
    });

  }

  ngOnInit() {
    this.estateKey = localStorage.getItem('estateKey');

    this.subscriptions.push(this._activatedRoute.params.subscribe((params) => {
      /* tslint:disable:no-string-literal */
      this.approvalKey = params['approvalKey'];
      if (this.approvalKey === '0') {
        this.approvalKey = '';
      }
      this.loadData();
    }));
  }

  loadData() {
    this.approvalTypeService.getAll(this.estateKey, (e) => this.getApprovalTypesCallback(e));

    if (this.approvalKey === '') {
      this.approvalModel = new ApprovalModel();
      this.frmApproval.reset(this.approvalModel);
      return;
    }
    this.approvalService.getRecord(this.approvalKey, (e) => this.getRecordCallback(e));
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
  getRecordCallback(callback: CallbackModel) {
    if (callback.success) {
      this.approvalModel = callback.data;
      this.frmApproval.reset(this.approvalModel);
      return;
    }

    this._snackBarService.open('Error getting approval', '', {
      duration: 2000
    });
  }

  saveClick(frmCmps) {
    if (this.approvalKey === '') {
      // Add
      let modelToSave: ApprovalModel = {
        key: this.commonSerivce.getNewGuid(),
        estateKey: localStorage.getItem('estateKey'),
        description: this.frmApproval.value.description,
        approvalTypeKey: this.frmApproval.value.approvalTypeKey,
        approvedItemKey: null,
        createdUserKey: localStorage.getItem('userKey'),
        dateCreated: new Date().toString(),
        isFinalised: false
      };

      this.approvalService.insertRecord(modelToSave, (e) => this.insertUpdateRecord(e));
      this._router.navigate(['/approvals']);
    } else {
      // Update
      let modelToSave: ApprovalModel = {
        key: this.approvalKey,
        estateKey: localStorage.getItem('estateKey'),
        description: this.frmApproval.value.description,
        approvalTypeKey: this.frmApproval.value.approvalTypeKey,
        approvedItemKey: null,
        createdUserKey: localStorage.getItem('userKey'),
        dateCreated: new Date().toString(),
        isFinalised: false
      };

      this.approvalService.updateRecord(modelToSave, (e) => this.insertUpdateRecord(e));
      this._router.navigate(['/approvals']);
    }
  }

  cancelClick() {
    this._router.navigate(['/approvals']);

  }

  insertUpdateRecord(callback: CallbackModel) {
    if (callback.success) {
      this._snackBarService.open('Execute successfull', undefined, { duration: 3000 });

      return;
    }
    this._snackBarService.open('Execute failed', undefined, { duration: 3000 });
  }
}
