import { Component, OnInit } from '@angular/core';
import { OwnerModel, CallbackModel } from '../../models';
import { MatSnackBar } from '../../../node_modules/@angular/material';
import { Router } from '../../../node_modules/@angular/router';
import { OwnerFirebaseServiceProvider } from '../../services';
import { TdLoadingService } from '../../../node_modules/@covalent/core';

@Component({
    selector: 'app-owners',
    templateUrl: './owners.component.html',
    styleUrls: ['./owners.component.scss']
})
export class OwnersComponent implements OnInit {
    owners: OwnerModel[] = [];
    estateKey: string = '';
    public icon: string = 'person';

    constructor(
        private _snackBarService: MatSnackBar,
        private _router: Router,
        public ownerService: OwnerFirebaseServiceProvider,
        private _loadingService: TdLoadingService
    ) {}

    ngOnInit() {
        this.estateKey = localStorage.getItem('estateKey');
        this.loadData();
    }

    loadData() {
        this.ownerService.getAll(this.estateKey, (e) => this.getAllForOwnerCallback(e));
    }

    getAllForOwnerCallback(callbackModel: CallbackModel) {
        this.owners = [];
        if (callbackModel.success) {
            this.owners = callbackModel.data;
            return;
        }

        this._snackBarService.open('Error getting owners', '', {
            duration: 2000
        });
    }

    detailClick(ownerModel: OwnerModel) {
        this._router.navigate(['/owners/' + ownerModel.key]);
    }
}
