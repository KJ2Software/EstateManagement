import { Component, OnInit } from '@angular/core';
import { TdLoadingService } from '../../../node_modules/@covalent/core';
import { MatSnackBar } from '../../../node_modules/@angular/material';
import { Router } from '../../../node_modules/@angular/router';
import { CallbackModel } from '../../models';

@Component({
  selector: 'app-approval-config',
  templateUrl: './approval-config.component.html',
  styleUrls: ['./approval-config.component.scss']
})
export class ApprovalConfigComponent implements OnInit {
  data: any[] = [];

  constructor(private _snackBarService: MatSnackBar, private _router: Router,
    private _loadingService: TdLoadingService) { }

  ngOnInit() {
  }

  loadData() {
    // this.categoryFirebaseServiceProvider.getAll((e) => this.getAllCategoriesCallback(e));

  }

  getAllCategoriesCallback(callbackModel: CallbackModel) {
    this.data = [];

    if (callbackModel.success) {
    }
  }
}
