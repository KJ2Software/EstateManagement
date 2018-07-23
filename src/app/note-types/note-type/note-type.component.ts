import { Component, OnInit } from '@angular/core';
import { TdDialogService } from '../../../../node_modules/@covalent/core';
import { MatSnackBar } from '../../../../node_modules/@angular/material';
import { Router, ActivatedRoute } from '../../../../node_modules/@angular/router';
import { FormBuilder, FormGroup, Validators } from '../../../../node_modules/@angular/forms';
import { NoteTypeFirebaseServiceProvider } from '../../../services';
import { NoteTypeModel, CallbackModel } from '../../../models';

@Component({
    selector: 'app-note-type',
    templateUrl: './note-type.component.html',
    styleUrls: ['./note-type.component.scss']
})
export class NoteTypeComponent implements OnInit {
    private noteTypeKey: string;
    private subscriptions: any[] = [];
    private noteTypeModel: NoteTypeModel = new NoteTypeModel();
    frmNoteType: FormGroup;

    constructor(
        private _dialogService: TdDialogService,
        private _snackBarService: MatSnackBar,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        public builder: FormBuilder,
        private noteTypeService: NoteTypeFirebaseServiceProvider
    ) {
        this.frmNoteType = builder.group({
            description: [{ value: '' }, Validators.required]
        });
    }

    ngOnInit(): void {
        this.subscriptions.push(
            this._activatedRoute.params.subscribe((params) => {
                /* tslint:disable:no-string-literal */
                this.noteTypeKey = params['noteTypeKey'];
                if (this.noteTypeKey === '0') {
                    this.noteTypeKey = '';
                }
                this.loadData();
            })
        );
    }

    loadData() {
        if (this.noteTypeKey === '') {
            this.noteTypeModel = new NoteTypeModel();
            this.frmNoteType.reset(this.noteTypeModel);
            return;
        }
        this.noteTypeService.getRecord(this.noteTypeKey, (e) => this.getRecordCallback(e));
    }

    getRecordCallback(callback: CallbackModel) {
        if (callback.success) {
            this.noteTypeModel = callback.data;
            this.frmNoteType.reset(this.noteTypeModel);
            return;
        }

        this._snackBarService.open('Error getting note types', '', {
            duration: 2000
        });
    }

    saveClick(frmCmps) {
        if (this.noteTypeKey === '') {
            // Add
            let modelToSave: NoteTypeModel = {
                key: this.getNewGuid(),
                estateKey: localStorage.getItem('estateKey'),
                description: this.frmNoteType.value.description
            };

            this.noteTypeService.insertRecord(modelToSave, (e) => this.insertUpdateRecord(e));
            this._router.navigate(['/note-types']);
        } else {
            // Update
            let modelToSave: NoteTypeModel = {
                key: this.noteTypeKey,
                estateKey: localStorage.getItem('estateKey'),
                description: this.frmNoteType.value.description
            };

            this.noteTypeService.updateRecord(modelToSave, (e) => this.insertUpdateRecord(e));
            this._router.navigate(['/note-types']);
        }
    }

    cancelClick() {
        this._router.navigate(['/note-types']);
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
