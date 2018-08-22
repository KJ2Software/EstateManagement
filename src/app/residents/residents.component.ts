import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ResidentModel, CallbackModel } from '../../models';
import { MatSnackBar } from '../../../node_modules/@angular/material';
import { Router } from '../../../node_modules/@angular/router';
import { ResidentFirebaseServiceProvider } from '../../services';
import { TdLoadingService, TdDialogService } from '../../../node_modules/@covalent/core';

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
        private _dialogService: TdDialogService,
        private _router: Router,
        public residentService: ResidentFirebaseServiceProvider,
        private _viewContainerRef: ViewContainerRef,
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

    deleteClick(residentModel: ResidentModel) {
        this.deleteConfirm(residentModel);
    }

    deleteConfirm(residentModel: ResidentModel): void {
        this._dialogService
            .openConfirm({
                // tslint:disable-next-line:max-line-length
                message: 'Are you sure you want to delete this record?',
                disableClose: true, // defaults to false
                viewContainerRef: this._viewContainerRef, // OPTIONAL
                title: 'Confirm', // OPTIONAL, hides if not provided
                cancelButton: 'Cancel', // OPTIONAL, defaults to 'CANCEL'
                acceptButton: 'OK', // OPTIONAL, defaults to 'ACCEPT'
                width: '500px' // OPTIONAL, defaults to 400px
            })
            .afterClosed()
            .subscribe((accept: boolean) => {
                if (accept) {
                    // DO SOMETHING
                    this.residentService.deleteRecord(residentModel.key, (e) => this.deleteCallback(e));
                } else {
                    // DO SOMETHING ELSE
                }
            });
    }

    deleteCallback(callbackModel: CallbackModel) {
        if (callbackModel.success) {
            this._snackBarService.open('Deleted Successfully', undefined, { duration: 3000 });
            return;
        }
        this._snackBarService.open('Delete Failed', undefined, { duration: 3000 });
    }

    mouseEnter(row: ResidentModel) {
        row.showButton = true;
    }

    mouseLeave(row: ResidentModel) {
        row.showButton = false;
    }
}
