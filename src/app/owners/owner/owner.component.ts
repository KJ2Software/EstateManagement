import { Component, OnInit } from '@angular/core';
import { TdDialogService } from '../../../../node_modules/@covalent/core';
import { MatSnackBar } from '../../../../node_modules/@angular/material';
import { Router, ActivatedRoute } from '../../../../node_modules/@angular/router';
import { FormBuilder, FormGroup, Validators } from '../../../../node_modules/@angular/forms';
import { OwnerFirebaseServiceProvider } from '../../../services';
import { OwnerModel, CallbackModel } from '../../../models';

@Component({
    selector: 'app-owner',
    templateUrl: './owner.component.html',
    styleUrls: ['./owner.component.scss']
})
export class OwnerComponent implements OnInit {
    private ownerKey: string;
    private subscriptions: any[] = [];
    private ownerModel: OwnerModel = new OwnerModel();
    frmOwner: FormGroup;

    constructor(
        private _dialogService: TdDialogService,
        private _snackBarService: MatSnackBar,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        public builder: FormBuilder,
        private ownerService: OwnerFirebaseServiceProvider
    ) {
        this.frmOwner = builder.group({
            firstname: [{ value: '' }, Validators.required],
            surname: [{ value: '' }, Validators.required],
            cellphone: [{ value: '' }, Validators.required],
            email: [{ value: '' }, Validators.required]
        });
    }

    ngOnInit(): void {
        this.subscriptions.push(
            this._activatedRoute.params.subscribe((params) => {
                /* tslint:disable:no-string-literal */
                this.ownerKey = params['ownerKey'];
                if (this.ownerKey === '0') {
                    this.ownerKey = '';
                }
                this.loadData();
            })
        );
    }

    loadData() {
        if (this.ownerKey === '') {
            this.ownerModel = new OwnerModel();
            this.frmOwner.reset(this.ownerModel);
            return;
        }
        this.ownerService.getRecord(this.ownerKey, (e) => this.getRecordCallback(e));
    }

    getRecordCallback(callback: CallbackModel) {
        if (callback.success) {
            this.ownerModel = callback.data;
            this.frmOwner.reset(this.ownerModel);
            return;
        }

        this._snackBarService.open('Error getting note types', '', {
            duration: 2000
        });
    }

    saveClick(frmCmps) {
        if (this.ownerKey === '') {
            // Add
            let modelToSave: OwnerModel = {
                key: this.getNewGuid(),
                estateKey: localStorage.getItem('estateKey'),
                firstname: this.frmOwner.value.firstname,
                surname: this.frmOwner.value.surname,
                cellphone: this.frmOwner.value.cellphone,
                email: this.frmOwner.value.email
            };

            this.ownerService.insertRecord(modelToSave, (e) => this.insertUpdateRecord(e));
            this._router.navigate(['/owners']);
        } else {
            // Update
            let modelToSave: OwnerModel = {
                key: this.ownerKey,
                estateKey: localStorage.getItem('estateKey'),
                firstname: this.frmOwner.value.firstname,
                surname: this.frmOwner.value.surname,
                cellphone: this.frmOwner.value.cellphone,
                email: this.frmOwner.value.email
            };

            this.ownerService.updateRecord(modelToSave, (e) => this.insertUpdateRecord(e));
            this._router.navigate(['/owners']);
        }
    }

    cancelClick() {
        this._router.navigate(['/owners']);
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
