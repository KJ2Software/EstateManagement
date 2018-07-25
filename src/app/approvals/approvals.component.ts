import { Component, OnInit } from '@angular/core';
import { ApprovalModel, CallbackModel } from '../../models';
import { MatSnackBar } from '../../../node_modules/@angular/material';
import { Router } from '../../../node_modules/@angular/router';
import { TdLoadingService } from '../../../node_modules/@covalent/core';
import { ApprovalFirebaseServiceProvider } from '../../services';

@Component({
  selector: 'app-approvals',
  templateUrl: './approvals.component.html',
  styleUrls: ['./approvals.component.scss']
})
export class ApprovalsComponent implements OnInit {
  approvals: ApprovalModel[] = [];

  constructor(private _snackBarService: MatSnackBar, private _router: Router,
    private approvalFirebaseService: ApprovalFirebaseServiceProvider,
    private _loadingService: TdLoadingService) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    let estateKey = localStorage.getItem('estateKey');
    this.approvalFirebaseService.getAll(estateKey, (e) => this.getAllForEstateCallback(e));
  }

  getAllForEstateCallback(callbackModel: CallbackModel) {
    this.approvals = [];
    if (callbackModel.success) {
      this.approvals = callbackModel.data;
      return;
    }

    this._snackBarService.open('Error getting approvals', '', {
      duration: 2000
    });
  }

  detailClick(approvalModel: ApprovalModel) {
    this._router.navigate(['/approvals/' + approvalModel.key]);
  }

  itemsClick(approvalModel: ApprovalModel) {
    this._router.navigate(['/approvals/' + approvalModel.key + '/approval-items']);
  }

}
