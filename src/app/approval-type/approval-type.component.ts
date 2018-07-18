import { Component, OnInit } from '@angular/core';
import { ApprovalTypeModel, CallbackModel } from '../../models';
import { Router } from '../../../node_modules/@angular/router';
import { MatSnackBar } from '../../../node_modules/@angular/material';
import { TdLoadingService } from '../../../node_modules/@covalent/core';
import { ApprovalTypeFirebaseServiceProvider } from '../../services';

@Component({
  selector: 'app-approval-type',
  templateUrl: './approval-type.component.html',
  styleUrls: ['./approval-type.component.scss']
})
export class ApprovalTypeComponent implements OnInit {
  approvalTypes: ApprovalTypeModel[] = [];

  constructor(private _snackBarService: MatSnackBar, private _router: Router,
    private approvalTypeService: ApprovalTypeFirebaseServiceProvider,
    private _loadingService: TdLoadingService) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    let estateKey = localStorage.getItem('estateKey');
    this.approvalTypeService.getAll(estateKey, (e) => this.getAllForEstateCallback(e));
  }

  getAllForEstateCallback(callbackModel: CallbackModel) {
    this.approvalTypes = [];
    if (callbackModel.success) {
      this.approvalTypes = callbackModel.data;
      return;
    }

    this._snackBarService.open('Error getting approvals', '', {
      duration: 2000
    });
  }

  detailClick(approvalTypeModel: ApprovalTypeModel) {
    this._router.navigate(['/approval-type-add-modify/' + approvalTypeModel.key]);
  }

}
