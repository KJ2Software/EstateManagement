import { Component, OnInit } from '@angular/core';
import { UnitModel, CallbackModel } from '../../models';
import { MatSnackBar } from '../../../node_modules/@angular/material';
import { Router } from '../../../node_modules/@angular/router';
import { UnitFirebaseServiceProvider } from '../../services';
import { TdLoadingService } from '../../../node_modules/@covalent/core';

@Component({
    selector: 'app-units',
    templateUrl: './units.component.html',
    styleUrls: ['./units.component.scss']
})
export class UnitsComponent implements OnInit {
    units: UnitModel[] = [];
    estateKey: string = '';
    public icon: string = 'build';

    constructor(
        private _snackBarService: MatSnackBar,
        private _router: Router,
        public unitService: UnitFirebaseServiceProvider,
        private _loadingService: TdLoadingService
    ) {}

    ngOnInit(): void {
        this.estateKey = localStorage.getItem('estateKey');
        this.loadData();
    }

    loadData() {
        this.unitService.getAll(this.estateKey, (e) => this.getAllForUnitCallback(e));
    }

    getAllForUnitCallback(callbackModel: CallbackModel) {
        this.units = [];
        if (callbackModel.success) {
            this.units = callbackModel.data;
            return;
        }

        this._snackBarService.open('Error getting units', '', {
            duration: 2000
        });
    }

    detailClick(unitModel: UnitModel) {
        this._router.navigate(['/units/' + unitModel.key]);
    }
}
