import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ApprovalTypeModel, CallbackModel } from '../../models';
import { Router } from '../../../node_modules/@angular/router';
import { MatSnackBar } from '../../../node_modules/@angular/material';
import { TdLoadingService, TdDialogService } from '../../../node_modules/@covalent/core';
import { ApprovalTypeFirebaseServiceProvider } from '../../services';

@Component({
  selector: 'app-approval-types',
  templateUrl: './approval-types.component.html',
  styleUrls: ['./approval-types.component.scss']
})
export class ApprovalTypesComponent implements OnInit {
  approvalTypes: ApprovalTypeModel[] = [];
  public icon: string = 'thumb_up';

  constructor(private _snackBarService: MatSnackBar, private _router: Router,
    private _dialogService: TdDialogService,
    private _viewContainerRef: ViewContainerRef,
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
    this._router.navigate(['/approval-types/' + approvalTypeModel.key]);
  }

  deleteClick(approvalTypeModel: ApprovalTypeModel) {
    this.deleteConfirm(approvalTypeModel);
  }

  deleteConfirm(approvalTypeModel: ApprovalTypeModel): void {
    this._dialogService.openConfirm({
      // tslint:disable-next-line:max-line-length
      message: 'Are you sure you want to delete this record',
      disableClose: true, // defaults to false
      viewContainerRef: this._viewContainerRef, // OPTIONAL
      title: 'Confirm', // OPTIONAL, hides if not provided
      cancelButton: 'Cancel', // OPTIONAL, defaults to 'CANCEL'
      acceptButton: 'OK', // OPTIONAL, defaults to 'ACCEPT'
      width: '500px' // OPTIONAL, defaults to 400px
    }).afterClosed().subscribe((accept: boolean) => {
      if (accept) {
        // DO SOMETHING
        this.approvalTypeService.deleteRecord(approvalTypeModel.key, (e) => this.deleteCallback(e));
      } else {
        // DO SOMETHING ELSE
      }
    });
  }

  deleteCallback(callbackModel: CallbackModel) {
    if (callbackModel.success) {
      this._snackBarService.open('Deleted Successfully', undefined, { duration: 3000 });
      return;
    }
    this._snackBarService.open('Delete Failed', undefined, { duration: 3000 });

  }

}
