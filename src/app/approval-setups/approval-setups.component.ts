import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { CallbackModel, ApprovalSetupModel, UserModel, ApprovalTypeModel, ApprovalSetupsViewModel } from '../../models';
import { Router } from '../../../node_modules/@angular/router';
import { MatSnackBar } from '../../../node_modules/@angular/material';
import { TdLoadingService, TdDialogService } from '../../../node_modules/@covalent/core';
import { ApprovalSetupFirebaseServiceProvider, UserFirebaseServiceProvider, ApprovalTypeFirebaseServiceProvider } from '../../services';

@Component({
  selector: 'app-approval-setups',
  templateUrl: './approval-setups.component.html',
  styleUrls: ['./approval-setups.component.scss']
})
export class ApprovalSetupsComponent implements OnInit {
  approvalSetups: ApprovalSetupModel[] = [];
  estateKey: string = '';
  dataLoaded: boolean = false;
  viewModels: ApprovalSetupsViewModel[] = [];
  public users: UserModel[] = [];
  public icon: string = 'build';
  public approvalTypes: ApprovalTypeModel[] = [];

  constructor(private _snackBarService: MatSnackBar, private _router: Router,
    private _dialogService: TdDialogService,
    private _viewContainerRef: ViewContainerRef,
    private approvalSetupService: ApprovalSetupFirebaseServiceProvider,
    private userService: UserFirebaseServiceProvider,
    private approvalTypeService: ApprovalTypeFirebaseServiceProvider,
    private _loadingService: TdLoadingService) { }

  ngOnInit() {
    this.estateKey = localStorage.getItem('estateKey');
    this.loadData();
  }

  loadData() {
    this.userService.getAll(this.estateKey, (e) => this.getAllUsersCallback(e));

  }

  getAllUsersCallback(callbackModel: CallbackModel) {
    this.users = [];
    if (callbackModel.success) {
      this.users = callbackModel.data;

      this.approvalTypeService.getAll(this.estateKey, (e) => this.getAllApprovalTypesCallback(e));

      return;
    }
    this._snackBarService.open('Error getting users', '', {
      duration: 2000
    });
  }

  getAllApprovalTypesCallback(callbackModel: CallbackModel) {
    this.approvalSetups = [];
    if (callbackModel.success) {
      this.approvalTypes = callbackModel.data;

      this.approvalSetupService.getAll(this.estateKey, (e) => this.getAllForEstateCallback(e));
      return;
    }
    this._snackBarService.open('Error getting approval Type', '', {
      duration: 2000
    });
  }

  getAllForEstateCallback(callbackModel: CallbackModel) {
    this.approvalSetups = [];
    if (callbackModel.success) {
      this.approvalSetups = callbackModel.data;
      this.buildModel();
      return;
    }
    this._snackBarService.open('Error getting approval setups', '', {
      duration: 2000
    });
  }

  buildModel() {
    this.viewModels = [];
    this.approvalSetups.forEach((appSetup) => {
      let userName = '';
      this.users.forEach((user) => {
        if (user.key === appSetup.userKey) {
          userName = user.name + ' ' + user.surname;
          return;
        }
      });

      let appTypeName = '';
      this.approvalTypes.forEach((appType) => {
        if (appType.key === appSetup.approvalTypeKey) {
          appTypeName = appType.name;
          return;
        }
      });
      this.viewModels.push({ name: userName, approvalType: appTypeName, approvalSetupKey: appSetup.key });
    });
  }

  detailClick(approvalSetupsViewModel: ApprovalSetupsViewModel) {
    this._router.navigate(['/approval-setups/' + approvalSetupsViewModel.approvalSetupKey]);
  }

  deleteClick(approvalSetupsViewModel: ApprovalSetupsViewModel) {
    this.deleteConfirm(approvalSetupsViewModel);
  }

  deleteCallback(callbackModel: CallbackModel) {
    if (callbackModel.success) {
      this._snackBarService.open('Deleted Successfully', undefined, { duration: 3000 });
      return;
    }

    this._snackBarService.open('Delete Failed', undefined, { duration: 3000 });

  }

  deleteConfirm(approvalSetupsViewModel: ApprovalSetupsViewModel): void {
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
        this.approvalSetupService.deleteRecord(approvalSetupsViewModel.approvalSetupKey, (e) => this.deleteCallback(e));
      } else {
        // DO SOMETHING ELSE
      }
    });
  }
}
