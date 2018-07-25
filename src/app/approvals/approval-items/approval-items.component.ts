import { Component, OnInit } from '@angular/core';
import { ApprovalItemModel, CallbackModel } from '../../../models';
import { MatSnackBar } from '../../../../node_modules/@angular/material';
import { ApprovalItemFirebaseServiceProvider } from '../../../services';
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
  approvalItems: ApprovalItemModel[] = [];

  constructor(private _snackBarService: MatSnackBar, private _activatedRoute: ActivatedRoute,  private _router: Router,
    private approvalItemFirebaseService: ApprovalItemFirebaseServiceProvider,
    private _loadingService: TdLoadingService) { }

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
      return;
    }

    this._snackBarService.open('Error getting approval items', '', {
      duration: 2000
    });
  }

  detailClick(approvalModel: ApprovalItemModel) {
    this._router.navigate(['/approval-item/' +  this.approvalKey + '/' + approvalModel.key]);
  }

  addClick() {
    this._router.navigate(['/approval-item/' + this.approvalKey + '/0']);
  }

  backClick() {
    this._router.navigate(['/approvals']);

  }

}
