import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '../../../node_modules/@angular/router';
import { OwnerFirebaseServiceProvider, ResidentFirebaseServiceProvider } from '../../services';
import { OwnerModel, ResidentModel, CallbackModel } from '../../models';
import { MatSnackBar } from '../../../node_modules/@angular/material';

@Component({
    selector: 'app-units',
    templateUrl: './units.component.html',
    styleUrls: ['./units.component.scss']
})
export class UnitsComponent implements OnInit {
    private unitKey: string;
    private subscriptions: any[] = [];
    private estateKey: string = '';
    public owners: OwnerModel[] = [];
    public residents: ResidentModel[] = [];

    constructor(
        private _activatedRoute: ActivatedRoute,
        private ownerService: OwnerFirebaseServiceProvider,
        private residentService: ResidentFirebaseServiceProvider,
        private _snackBarService: MatSnackBar
    ) {
        this.estateKey = localStorage.getItem('estateKey');
    }

    ngOnInit(): void {
    }

}
