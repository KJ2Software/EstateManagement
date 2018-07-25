import { Component, OnInit } from '@angular/core';
import { ApprovalItemModel, CallbackModel } from '../../../../models';
import { MatSnackBar } from '../../../../../node_modules/@angular/material';
import { Router, ActivatedRoute } from '../../../../../node_modules/@angular/router';
import { FormBuilder, FormGroup, Validators } from '../../../../../node_modules/@angular/forms';
import { ApprovalItemFirebaseServiceProvider, CommonService } from '../../../../services';

@Component({
  selector: 'app-approval-item',
  templateUrl: './approval-item.component.html',
  styleUrls: ['./approval-item.component.scss']
})
export class ApprovalItemComponent implements OnInit {
  private estateKey: string;
  private approvalKey: string;
  private approvalItemKey: string;
  private subscriptions: any[] = [];
  public approvalItemModel: ApprovalItemModel = new ApprovalItemModel();
  frmApprovalItem: FormGroup;

  constructor(private _snackBarService: MatSnackBar, private _router: Router,
    private _activatedRoute: ActivatedRoute, public builder: FormBuilder,
    private approvalItemService: ApprovalItemFirebaseServiceProvider,
    private commonSerivce: CommonService) {
    this.frmApprovalItem = builder.group({
      'price': [{ value: '' }, Validators.required],
      'comments': [{ value: '' }, Validators.required]
    });
  }

  ngOnInit() {
    this.estateKey = localStorage.getItem('estateKey');

    this.subscriptions.push(this._activatedRoute.params.subscribe((params) => {
      /* tslint:disable:no-string-literal */
      this.approvalKey = params['approvalKey'];

      this.approvalItemKey = params['approvalItemKey'];
      if (this.approvalItemKey === '0') {
        this.approvalItemKey = '';
      }

      this.loadData();
    }));
  }

  loadData() {
    if (this.approvalItemKey === '') {
      this.approvalItemModel = new ApprovalItemModel();
      this.frmApprovalItem.reset(this.approvalItemModel);
      return;
    }
    this.approvalItemService.getRecord(this.approvalItemKey, (e) => this.getRecordCallback(e));
  }

  getRecordCallback(callback: CallbackModel) {
    if (callback.success) {
      this.approvalItemModel = callback.data;
      this.frmApprovalItem.reset(this.approvalItemModel);
      return;
    }

    this._snackBarService.open('Error getting approval', '', {
      duration: 2000
    });
  }

  saveClick(frmCmps) {
    if (this.approvalItemKey === '') {
      // Add
      let modelToSave: ApprovalItemModel = {
        key: this.commonSerivce.getNewGuid(),
        approvalKey: this.approvalKey,
        price: this.frmApprovalItem.value.price,
        comments: this.frmApprovalItem.value.comments,
        attachmentLink: ''
      };

      this.approvalItemService.insertRecord(modelToSave, (e) => this.insertUpdateRecord(e));
      this._router.navigate(['/approval-items/' + this.approvalKey]);
    } else {
      // Update
      let modelToSave: ApprovalItemModel = {
        key: this.approvalItemKey,
        approvalKey: this.approvalKey,
        price: this.frmApprovalItem.value.price,
        comments: this.frmApprovalItem.value.comments,
        attachmentLink: ''
      };

      this.approvalItemService.updateRecord(modelToSave, (e) => this.insertUpdateRecord(e));
      this._router.navigate(['/approval-items/' + this.approvalKey]);
    }
  }

  insertUpdateRecord(callback: CallbackModel) {
    if (callback.success) {
      this._snackBarService.open('Execute successfull', undefined, { duration: 3000 });

      return;
    }
    this._snackBarService.open('Execute failed', undefined, { duration: 3000 });
  }

  cancelClick() {
    this._router.navigate(['/approval-items/' + this.approvalKey]);

  }

}
