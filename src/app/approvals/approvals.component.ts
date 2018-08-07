import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ApprovalModel, CallbackModel, ApprovalSetupModel, EmailModel, UserModel } from '../../models';
import { MatSnackBar } from '../../../node_modules/@angular/material';
import { Router } from '../../../node_modules/@angular/router';
import { TdLoadingService, TdDialogService } from '../../../node_modules/@covalent/core';
import { ApprovalFirebaseServiceProvider, ApprovalSetupFirebaseServiceProvider, UserFirebaseServiceProvider, EmailService } from '../../services';

@Component({
  selector: 'app-approvals',
  templateUrl: './approvals.component.html',
  styleUrls: ['./approvals.component.scss']
})
export class ApprovalsComponent implements OnInit {
  approvals: ApprovalModel[] = [];
  estateKey: string = '';

  constructor(private _snackBarService: MatSnackBar, private _router: Router,
    private approvalFirebaseService: ApprovalFirebaseServiceProvider,
    private _dialogService: TdDialogService,
    private _viewContainerRef: ViewContainerRef,
    private approvalSetupFirebaseService: ApprovalSetupFirebaseServiceProvider,
    private userFirebaseService: UserFirebaseServiceProvider,
    private emailService: EmailService,
    private _loadingService: TdLoadingService) {
    this.estateKey = localStorage.getItem('estateKey');

  }

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

  finalizeClick(approvalModel: ApprovalModel) {
    this.finaliseConfirm(approvalModel);
  }

  emailClick(approvalModel: ApprovalModel) {

    this.approvalSetupFirebaseService.getAllForApprovalType(this.estateKey, approvalModel.approvalTypeKey, (e) => this.approvalSetupCallback(e));
  }

  updateCallback(callbackModel: CallbackModel) {
    if (!callbackModel.success) {
      this._snackBarService.open('Error finalising approval', '', {
        duration: 2000
      });
      return;
    }

    this._snackBarService.open('Finalising approval successfully', '', {
      duration: 2000
    });
  }

  approvalSetupCallback(callbackModel: CallbackModel) {
    if (!callbackModel.success) {
      this._snackBarService.open('Error getting settings', '', {
        duration: 2000
      });
      return;
    }

    let appSetupModels: ApprovalSetupModel[] = callbackModel.data;

    if (appSetupModels.length === 0) {
      this._snackBarService.open('No users for this approval type', '', {
        duration: 2000
      });
    }

    appSetupModels.forEach((appSetup: ApprovalSetupModel) => {
      this.userFirebaseService.getRecord(appSetup.userKey, (e) => this.userCallback(e));
    });

  }

  userCallback(callbackModel: CallbackModel) {
    if (!callbackModel.success) {
      this._snackBarService.open('Error getting user', '', {
        duration: 2000
      });
      return;
    }

    let userModel: UserModel = callbackModel.data;

    let emailModel: EmailModel = {
      fromName: 'Estate Management Team',
      replyTo: 'kj2software@gmail.com',
      to: userModel.email,
      toName: userModel.name + ' ' + userModel.surname,
      messageHtml: '<strong>Please note that there are new approvals loaded</string>'
    };
    this.emailService.sendEmail(emailModel, (e) => this.emailCallback(e));
  }

  emailCallback(callbackModel: CallbackModel) {
    if (!callbackModel.success) {
      this._snackBarService.open('Error sending email', '', {
        duration: 2000
      });
      return;
    }

    this._snackBarService.open('Sending successfully', '', {
      duration: 2000
    });
  }

  finaliseConfirm(approvalModel: ApprovalModel): void {
    this._dialogService.openConfirm({
      // tslint:disable-next-line:max-line-length
      message: 'Are you sure you want to finalise this approval',
      disableClose: true, // defaults to false
      viewContainerRef: this._viewContainerRef, // OPTIONAL
      title: 'Confirm', // OPTIONAL, hides if not provided
      cancelButton: 'Cancel', // OPTIONAL, defaults to 'CANCEL'
      acceptButton: 'OK', // OPTIONAL, defaults to 'ACCEPT'
      width: '500px' // OPTIONAL, defaults to 400px
    }).afterClosed().subscribe((accept: boolean) => {
      if (accept) {
        // DO SOMETHING
        approvalModel.isFinalised = true;
        this.approvalFirebaseService.updateRecord(approvalModel, (e) => this.updateCallback(e));
      } else {
        // DO SOMETHING ELSE
      }
    });
  }
}
