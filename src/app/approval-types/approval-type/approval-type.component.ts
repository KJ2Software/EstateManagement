import { Component, OnInit } from '@angular/core';
import { TdDialogService } from '../../../../node_modules/@covalent/core';
import { MatSnackBar } from '../../../../node_modules/@angular/material';
import { Router, ActivatedRoute } from '../../../../node_modules/@angular/router';
import { FormBuilder, FormGroup, Validators } from '../../../../node_modules/@angular/forms';
import { ApprovalTypeFirebaseServiceProvider } from '../../../services';
import { ApprovalTypeModel, CallbackModel } from '../../../models';

@Component({
  selector: 'app-approval-type',
  templateUrl: './approval-type.component.html',
  styleUrls: ['./approval-type.component.scss']
})
export class ApprovalTypeComponent implements OnInit {
  private approvalTypeKey: string;
  private subscriptions: any[] = [];
  private approvalTypeModel: ApprovalTypeModel = new ApprovalTypeModel();
  frmApprovalType: FormGroup;

  constructor(private _dialogService: TdDialogService, private _snackBarService: MatSnackBar, private _router: Router,
    private _activatedRoute: ActivatedRoute, public builder: FormBuilder,
    private approvalTypeService: ApprovalTypeFirebaseServiceProvider) {
    this.frmApprovalType = builder.group({
      'name': [{ value: '' }, Validators.required]
    });
  }

  ngOnInit(): void {
    this.subscriptions.push(this._activatedRoute.params.subscribe((params) => {
      /* tslint:disable:no-string-literal */
      this.approvalTypeKey = params['approvalTypeKey'];
      if (this.approvalTypeKey === '0') {
        this.approvalTypeKey = '';
      }
      this.loadData();
    }));
  }

  loadData() {
    if (this.approvalTypeKey === '') {
      this.approvalTypeModel = new ApprovalTypeModel();
      this.frmApprovalType.reset(this.approvalTypeModel);
      return;
    }
    this.approvalTypeService.getRecord(this.approvalTypeKey, (e) => this.getRecordCallback(e));
  }

  getRecordCallback(callback: CallbackModel) {
    if (callback.success) {
      this.approvalTypeModel = callback.data;
      this.frmApprovalType.reset(this.approvalTypeModel);
      return;
    }

    this._snackBarService.open('Error getting approval types', '', {
      duration: 2000
    });
  }

  saveClick(frmCmps) {
    if (this.approvalTypeKey === '') {
      // Add
      let modelToSave: ApprovalTypeModel = {
        key: this.getNewGuid(),
        estateKey: localStorage.getItem('estateKey'),
        name: this.frmApprovalType.value.name
      };

      this.approvalTypeService.insertRecord(modelToSave, (e) => this.insertUpdateRecord(e));
      this._router.navigate(['/approval-types']);
    } else {
      // Update
      let modelToSave: ApprovalTypeModel = {
        key: this.approvalTypeKey,
        estateKey: localStorage.getItem('estateKey'),
        name: this.frmApprovalType.value.name
      };

      this.approvalTypeService.updateRecord(modelToSave, (e) => this.insertUpdateRecord(e));
      this._router.navigate(['/approval-types']);
    }
  }

  cancelClick() {
    this._router.navigate(['/approval-types']);

  }
  insertUpdateRecord(callback: CallbackModel) {
    if (callback.success) {
      this._snackBarService.open('Execute successfull', undefined, { duration: 3000 });

      return;
    }
    this._snackBarService.open('Execute failed', undefined, { duration: 3000 });
  }

  getNewGuid(): string {
    let d = new Date().getTime();
    let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      // tslint:disable-next-line:no-bitwise
      let r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      // tslint:disable-next-line:no-bitwise
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  }

}
