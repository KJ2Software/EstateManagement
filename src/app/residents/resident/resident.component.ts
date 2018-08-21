import { Component, OnInit } from '@angular/core';
import { TdDialogService } from '../../../../node_modules/@covalent/core';
import { MatSnackBar, MatDatepickerModule } from '../../../../node_modules/@angular/material';
import { Router, ActivatedRoute } from '../../../../node_modules/@angular/router';
import { FormBuilder, FormGroup, Validators } from '../../../../node_modules/@angular/forms';
import { ResidentFirebaseServiceProvider } from '../../../services';
import { ResidentModel, CallbackModel } from '../../../models';

@Component({
    selector: 'app-resident',
    templateUrl: './resident.component.html',
    styleUrls: ['./resident.component.scss']
})
export class ResidentComponent implements OnInit {
    private residentKey: string;
    private subscriptions: any[] = [];
    private residentModel: ResidentModel = new ResidentModel();
    frmResident: FormGroup;

    constructor(
        private _dialogService: TdDialogService,
        private _snackBarService: MatSnackBar,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        public builder: FormBuilder,
        private residentService: ResidentFirebaseServiceProvider
    ) {
        this.frmResident = builder.group({
            firstname: [{ value: '' }, Validators.required],
            surname: [{ value: '' }, Validators.required],
            cellphone: [{ value: '' }, Validators.required],
            email: [{ value: '' }, Validators.required],
            leaseStart: [{ value: '' }, Validators.required],
            leaseEnd: [{ value: '' }, Validators.required]
        });
    }

    ngOnInit(): void {
        this.subscriptions.push(
            this._activatedRoute.params.subscribe((params) => {
                /* tslint:disable:no-string-literal */
                this.residentKey = params['residentKey'];
                if (this.residentKey === '0') {
                    this.residentKey = '';
                }
                this.loadData();
            })
        );
    }

    loadData() {
        if (this.residentKey === '') {
            this.residentModel = new ResidentModel();
            this.frmResident.reset(this.residentModel);
            return;
        }
        this.residentService.getRecord(this.residentKey, (e) => this.getRecordCallback(e));
    }

    getRecordCallback(callback: CallbackModel) {
        if (callback.success) {
            this.residentModel = callback.data;
            this.frmResident.reset(this.residentModel);
            return;
        }

        this._snackBarService.open('Error getting note types', '', {
            duration: 2000
        });
    }

    saveClick(frmCmps) {
        if (this.residentKey === '') {
            // Add
            let modelToSave: ResidentModel = {
                key: this.getNewGuid(),
                estateKey: localStorage.getItem('estateKey'),
                firstname: this.frmResident.value.firstname,
                surname: this.frmResident.value.surname,
                cellphone: this.frmResident.value.cellphone,
                email: this.frmResident.value.email,
                leaseStart: this.frmResident.value.leaseStart,
                leaseEnd: this.frmResident.value.leaseEnd,
                showButton: this.frmResident.value.showButton
            };

            this.residentService.insertRecord(modelToSave, (e) => this.insertUpdateRecord(e));
            this._router.navigate(['/residents']);
        } else {
            // Update
            let modelToSave: ResidentModel = {
                key: this.residentKey,
                estateKey: localStorage.getItem('estateKey'),
                firstname: this.frmResident.value.firstname,
                surname: this.frmResident.value.surname,
                cellphone: this.frmResident.value.cellphone,
                email: this.frmResident.value.email,
                leaseStart: this.frmResident.value.leaseStart,
                leaseEnd: this.frmResident.value.leaseEnd,
                showButton: this.frmResident.value.showButton
            };

            this.residentService.updateRecord(modelToSave, (e) => this.insertUpdateRecord(e));
            this._router.navigate(['/residents']);
        }
    }

    cancelClick() {
        this._router.navigate(['/residents']);
    }
    insertUpdateRecord(callback: CallbackModel) {
        if (callback.success) {
            this._snackBarService.open('Execute successfull', undefined, { duration: 3000 });

            return;
        }
        this._snackBarService.open('Execute failed', undefined, { duration: 3000 });
    }

    getNewGuid(): string {
        let d = new Date().getTime();
        let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            // tslint:disable-next-line:no-bitwise
            let r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            // tslint:disable-next-line:no-bitwise
            return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
        });
        return uuid;
    }
}
