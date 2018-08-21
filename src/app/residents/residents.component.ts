import { Component, OnInit } from '@angular/core';
import { ResidentModel, CallbackModel } from '../../models';
import { MatSnackBar } from '../../../node_modules/@angular/material';
import { Router } from '../../../node_modules/@angular/router';
import { ResidentFirebaseServiceProvider } from '../../services';
import { TdLoadingService } from '../../../node_modules/@covalent/core';

@Component({
    selector: 'app-residents',
    templateUrl: './residents.component.html',
    styleUrls: ['./residents.component.scss']
})
export class ResidentsComponent implements OnInit {
    residents: ResidentModel[] = [];
    estateKey: string = '';
    rowHover: boolean = false;
    public icon: string = 'people';

    constructor(
        private _snackBarService: MatSnackBar,
        private _router: Router,
        public residentService: ResidentFirebaseServiceProvider,
        private _loadingService: TdLoadingService
    ) {}

    ngOnInit() {
        this.estateKey = localStorage.getItem('estateKey');
        this.loadData();
    }

    loadData() {
        this.residentService.getAll(this.estateKey, (e) => this.getAllForResidentCallback(e));
    }

    getAllForResidentCallback(callbackModel: CallbackModel) {
        this.residents = [];
        if (callbackModel.success) {
            this.residents = callbackModel.data;
            // this.buildModel();
            return;
        }

        this._snackBarService.open('Error getting residents', '', {
            duration: 2000
        });
    }

    detailClick(residentModel: ResidentModel) {
        this._router.navigate(['/residents/' + residentModel.key]);
    }

    mouseEnter(row: ResidentModel) {
        row.showButton = true;
    }

    mouseLeave(row: ResidentModel) {
        row.showButton = false;
    }
}
