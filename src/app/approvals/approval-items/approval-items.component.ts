import { Component, OnInit } from '@angular/core';
import { ApprovalItemModel, CallbackModel, ApprovalItemResultModel, ApprovalItemViewModel } from '../../../models';
import { MatSnackBar } from '../../../../node_modules/@angular/material';
import { ApprovalItemFirebaseServiceProvider, ApprovalItemResultFirebaseServiceProvider, CommonService } from '../../../services';
import { TdLoadingService } from '../../../../node_modules/@covalent/core';
import { Router, ActivatedRoute } from '../../../../node_modules/@angular/router';

@Component({
  selector: 'app-approval-items',
  templateUrl: './approval-items.component.html',
  styleUrls: ['./approval-items.component.scss']
})
export class ApprovalItemsComponent implements OnInit {
  private subscriptions: any[] = [];
  private approvalKey: string;
  private userApproved: ApprovalItemResultModel[] = [];
  private userKey: string = '';
  public approvalItems: ApprovalItemModel[] = [];
  public approvalItemViewModel: ApprovalItemViewModel[] = [];

  constructor(private _snackBarService: MatSnackBar, private _activatedRoute: ActivatedRoute, private _router: Router,
    private commonService: CommonService,
    private approvalItemFirebaseService: ApprovalItemFirebaseServiceProvider,
    private approvalItemResultFirebaseService: ApprovalItemResultFirebaseServiceProvider,
    private _loadingService: TdLoadingService) {
    this.userKey = localStorage.getItem('userKey');
  }

  ngOnInit() {

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
    this.approvalItemFirebaseService.getAll(this.approvalKey, (e) => this.getAllForEstateCallback(e));
  }

  getAllForEstateCallback(callbackModel: CallbackModel) {
    this.approvalItems = [];
    if (callbackModel.success) {
      this.approvalItems = callbackModel.data;
      this.approvalItemResultFirebaseService.getAllForUserAndApproval(this.approvalKey, this.userKey, (e) => this.getResultsCallback(e));

      return;
    }

    this._snackBarService.open('Error getting approval items', '', {
      duration: 2000
    });
  }

  detailClick(approvalModel: ApprovalItemModel) {
    this._router.navigate(['/approvals/' + this.approvalKey + '/approval-items/' + approvalModel.key]);
  }

  addClick() {
    this._router.navigate(['/approvals/' + this.approvalKey + '/approval-items/0']);
  }

  backClick() {
    this._router.navigate(['/approvals']);

  }

  getResultsCallback(callbackModel: CallbackModel) {
    this.userApproved = [];
    if (callbackModel.success) {
      this.userApproved = callbackModel.data;

      this.approvalItemViewModel = [];
      this.approvalItems.forEach((appItem) => {
        let viewModel: ApprovalItemViewModel = {
          key: appItem.key,
          comments: appItem.comments,
          price: appItem.price,
          attachmentLink: appItem.attachmentLink,
          approvalKey: appItem.approvalKey,
          approvalItemResultKey: '',
          isApproved: false,
          approvedCount: 0
        };

        this.userApproved.forEach((appResult) => {
          if (appResult.approvalItemKey === appItem.key) {
            viewModel.isApproved = true;
          }
        });

        this.approvalItemResultFirebaseService.getAll(this.approvalKey, (e) => this.getAllCallback(e));

        this.approvalItemViewModel.push(viewModel);
      });

      return;
    }

  }

  getAllCallback(callbackModel: CallbackModel) {
    if (!callbackModel.success) {
      this._snackBarService.open('Error', '', {
        duration: 2000
      });
      return;
    }

    this.approvalItemViewModel.forEach((vm) => {
      vm.approvedCount = 0;
    });

    let result: ApprovalItemResultModel[] = [];
    result = callbackModel.data;

    result.forEach((appItemResult) => {
      this.approvalItemViewModel.forEach((vm) => {
        if (vm.key === appItemResult.approvalItemKey) {
          vm.approvedCount++;
        }
      });
    });

  }

  approveClick(approvalItem: ApprovalItemViewModel) {

    let canProcess = true;
    this.userApproved.forEach((userAppr) => {
      if (userAppr.approvalItemKey === approvalItem.key) {
        canProcess = false;
        return;
      }
    });

    if (!canProcess) {
      this._snackBarService.open('Action not allowed', '', {
        duration: 2000
      });

      return;
    }
    this.userApproved.forEach((userAppr) => {
      this.approvalItemResultFirebaseService.deleteRecord(userAppr.key, (callbackModel) => { });
    });

    let model: ApprovalItemResultModel = {
      key: this.commonService.getNewGuid(),
      approvalItemKey: approvalItem.key,
      approvalKey: this.approvalKey,
      comments: 'MyComments todo',
      userKey: this.userKey
    };

    this.approvalItemResultFirebaseService.insertRecord(model, (e) => this.approveItemCallback(e));
  }

  approveItemCallback(callbackModel: CallbackModel) {
    if (!callbackModel.success) {
      this._snackBarService.open('Error approving', '', {
        duration: 2000
      });
    }

    this._snackBarService.open('Approved Successfully', '', {
      duration: 2000
    });

    this.loadData();
  }

  uploadFileClick(approvalItem: ApprovalItemModel) {
    this._router.navigate(['uploadFile/approvals/' + this.approvalKey + '/approvalItems/' + approvalItem.key]);
  }
}
