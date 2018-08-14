import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '../../../../node_modules/@angular/material';
import { OwnerModel, ResidentModel, CallbackModel, UnitModel } from '../../../models';
import { ActivatedRoute, Router } from '../../../../node_modules/@angular/router';
import { OwnerFirebaseServiceProvider, ResidentFirebaseServiceProvider, CommonService } from '../../../services';
import { FormGroup, FormBuilder, Validators } from '../../../../node_modules/@angular/forms';
import { UnitFirebaseServiceProvider } from '../../../services/firebase/unit-firebase-service-provider';

@Component({
    selector: 'app-unit',
    templateUrl: './unit.component.html',
    styleUrls: ['./unit.component.scss']
})
export class UnitComponent implements OnInit {
    private unitKey: string;
    private subscriptions: any[] = [];
    private estateKey: string = '';
    private unitModel: UnitModel = new UnitModel();
    public owners: OwnerModel[] = [];
    public residents: ResidentModel[] = [];
    frmUnit: FormGroup;

    constructor(
        private _activatedRoute: ActivatedRoute,
        private ownerService: OwnerFirebaseServiceProvider,
        private residentService: ResidentFirebaseServiceProvider,
        private unitService: UnitFirebaseServiceProvider,
        private _snackBarService: MatSnackBar,
        public builder: FormBuilder,
        private _router: Router,
        private commonService: CommonService
    ) {
        this.frmUnit = builder.group({
            number: [{ value: '' }, Validators.required],
            ownerKey: [{ value: '' }, Validators.required],
            residentKey: [{ value: '' }, Validators.required]
        });

        this.estateKey = localStorage.getItem('estateKey');
    }

    ngOnInit(): void {
        this.subscriptions.push(
            this._activatedRoute.params.subscribe((params) => {
                /* tslint:disable:no-string-literal */
                this.unitKey = params['unitKey'];
                if (this.unitKey === '0') {
                    this.unitKey = '';
                }
                this.loadData();
            })
        );
    }

    loadData() {
        this.ownerService.getAll(this.estateKey, (e) => this.getOwnersCallback(e));
        this.residentService.getAll(this.estateKey, (e) => this.getResidentsCallback(e));

        if (this.unitKey === '') {
            this.unitModel = new UnitModel();
            this.frmUnit.reset(this.unitModel);
            return;
        }
        this.unitService.getRecord(this.unitKey, (e) => this.getRecordCallback(e));
    }

    getOwnersCallback(callback: CallbackModel) {
        if (callback.success) {
            this.owners = callback.data;
            return;
        }
        this._snackBarService.open('Error getting owners', '', {
            duration: 2000
        });
    }

    getResidentsCallback(callback: CallbackModel) {
        if (callback.success) {
            this.residents = callback.data;
            return;
        }
        this._snackBarService.open('Error getting residents', '', {
            duration: 2000
        });
    }

    getRecordCallback(callback: CallbackModel) {
        if (callback.success) {
            this.unitModel = callback.data;
            this.frmUnit.reset(this.unitModel);
            return;
        }

        this._snackBarService.open('Error getting unit', '', {
            duration: 2000
        });
    }

    cancelClick() {
        this._router.navigate(['/approval-setups']);
    }

    saveClick(frmCmps) {
        this.confirmNoDuplicates(this.frmUnit.value.number);
    }

    confirmNoDuplicates(unitNumber: number) {
        this.unitService.getAllForUnitNumber(this.estateKey, unitNumber, (e) => this.confirmNoDuplicatesCallback(e));
    }

    confirmNoDuplicatesCallback(callbackModel: CallbackModel) {
        if (callbackModel.success) {
            let haveDup = false;
            callbackModel.data.forEach((existing: UnitModel) => {
                if (existing.number === this.frmUnit.value.number) {
                    if (existing.key !== this.unitKey) {
                        haveDup = true;
                        return;
                    }
                }
            });

            if (haveDup) {
                this._snackBarService.open('Duplicate entry detected', undefined, { duration: 3000 });
                return;
            }
            this.save();
            return;
        }
        this._snackBarService.open('Unable to verify duplicates', undefined, { duration: 3000 });
    }

    save() {
        if (this.unitKey === '') {
            // Add
            let modelToSave: UnitModel = {
                key: this.commonService.getNewGuid(),
                estateKey: localStorage.getItem('estateKey'),
                number: this.frmUnit.value.number,
                ownerKey: this.frmUnit.value.ownerKey,
                residentKey: this.frmUnit.value.residentKey
            };

            this.unitService.insertRecord(modelToSave, (e) => this.insertUpdateRecord(e));
            this._router.navigate(['/approval-setups']);
        } else {
            // Update
            let modelToSave: UnitModel = {
                key: this.unitKey,
                estateKey: localStorage.getItem('estateKey'),
                number: this.frmUnit.value.number,
                ownerKey: this.frmUnit.value.ownerKey,
                residentKey: this.frmUnit.value.residentKey
            };

            this.unitService.updateRecord(modelToSave, (e) => this.insertUpdateRecord(e));
            this._router.navigate(['/approval-setups']);
        }
    }

    insertUpdateRecord(callback: CallbackModel) {
        if (callback.success) {
            this._snackBarService.open('Execute successfull', undefined, { duration: 3000 });
            return;
        }
        this._snackBarService.open('Execute failed', undefined, { duration: 3000 });
    }
}
