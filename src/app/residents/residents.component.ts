import { Component, OnInit } from '@angular/core';
import { ResidentModel, CallbackModel } from '../../models';
import { MatSnackBar } from '../../../node_modules/@angular/material';
import { Router } from '../../../node_modules/@angular/router';
import { ResidentFirebaseServiceProvider } from '../../services/firebase/resident-firebase-service-provider';

@Component({
    selector: 'app-residents',
    templateUrl: './residents.component.html',
    styleUrls: ['./residents.component.scss']
})
export class ResidentsComponent implements OnInit {
    residents: ResidentModel[] = [];
    public icon: string = 'people';

    constructor(
      private _snackBarService: MatSnackBar,
      private _router: Router,
      public residentService: ResidentFirebaseServiceProvider
    ) {}

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        let estateKey = localStorage.getItem('estateKey');
        this.residentService.getAll(estateKey, (e) => this.getAllForEstateCallback(e));
    }

    getAllForEstateCallback(callbackModel: CallbackModel) {
        this.residents = [];
        if (callbackModel.success) {
            this.residents = callbackModel.data;
            return;
        }

        this._snackBarService.open('Error getting residents', '', {
            duration: 2000
        });
    }

    detailClick(residentModel: ResidentModel) {
        this._router.navigate(['/residents/' + residentModel.key]);
    }
}
