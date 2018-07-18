import { Component, OnInit } from '@angular/core';
import { CallbackModel, ApprovalSetupModel } from '../../models';
import { Router } from '../../../node_modules/@angular/router';
import { MatSnackBar } from '../../../node_modules/@angular/material';
import { TdLoadingService } from '../../../node_modules/@covalent/core';
import { ApprovalSetupFirebaseServiceProvider } from '../../services';

@Component({
  selector: 'app-approval-setups',
  templateUrl: './approval-setups.component.html',
  styleUrls: ['./approval-setups.component.scss']
})
export class ApprovalSetupsComponent implements OnInit {
  approvalSetups: ApprovalSetupModel[] = [];

  constructor(private _snackBarService: MatSnackBar, private _router: Router,
    private approvalSetupService: ApprovalSetupFirebaseServiceProvider,
    private _loadingService: TdLoadingService) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    let estateKey = localStorage.getItem('estateKey');
    this.approvalSetupService.getAll(estateKey, (e) => this.getAllForEstateCallback(e));
  }

  getAllForEstateCallback(callbackModel: CallbackModel) {
    this.approvalSetups = [];
    if (callbackModel.success) {
      this.approvalSetups = callbackModel.data;
      return;
    }
    console.log(callbackModel.data);
    this._snackBarService.open('Error getting approval setups', '', {
      duration: 2000
    });
  }

  detailClick(approvalTypeModel: ApprovalSetupModel) {
    this._router.navigate(['/approval-setups/' + approvalTypeModel.key]);
  }

}
