import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '../../../../node_modules/@angular/material';
import { NoteTypeModel, CallbackModel, NoteModel } from '../../../models';
import { ActivatedRoute, Router } from '../../../../node_modules/@angular/router';
import { NoteTypeFirebaseServiceProvider, CommonService } from '../../../services';
import { FormGroup, FormBuilder, Validators } from '../../../../node_modules/@angular/forms';
import { NoteFirebaseServiceProvider } from '../../../services/firebase/note-firebase-service-provider';

@Component({
    selector: 'app-note',
    templateUrl: './note.component.html',
    styleUrls: ['./note.component.scss']
})
export class NoteComponent implements OnInit {
    private noteKey: string;
    private subscriptions: any[] = [];
    private estateKey: string = '';
    private noteModel: NoteModel = new NoteModel();
    public noteTypes: NoteTypeModel[] = [];
    frmNote: FormGroup;

    constructor(
        private _activatedRoute: ActivatedRoute,
        private noteTypeService: NoteTypeFirebaseServiceProvider,
        private noteService: NoteFirebaseServiceProvider,
        private _snackBarService: MatSnackBar,
        public builder: FormBuilder,
        private _router: Router,
        private commonService: CommonService
    ) {
        this.frmNote = builder.group({
            noteTypeKey: [{ value: '' }, Validators.required],
            date: [{ value: '' }, Validators.required],
            comment: [{ value: '' }, Validators.required],
            unit: [{ value: '' }, Validators.required]
        });
        this.estateKey = localStorage.getItem('estateKey');
    }

    ngOnInit(): void {
        this.subscriptions.push(
            this._activatedRoute.params.subscribe((params) => {
                /* tslint:disable:no-string-literal */
                this.noteKey = params['noteKey'];
                if (this.noteKey === '0') {
                    this.noteKey = '';
                }
                this.loadData();
            })
        );
    }

    loadData() {
        this.noteTypeService.getAll(this.estateKey, (e) => this.getNoteTypesCallback(e));

        if (this.noteKey === '') {
            this.noteModel = new NoteModel();
            this.frmNote.reset(this.noteModel);
            return;
        }
        this.noteService.getRecord(this.noteKey, (e) => this.getRecordCallback(e));
    }

    getNoteTypesCallback(callback: CallbackModel) {
        if (callback.success) {
            this.noteTypes = callback.data;
            return;
        }
        this._snackBarService.open('Error getting note Types', '', {
            duration: 2000
        });
    }

    getRecordCallback(callback: CallbackModel) {
        if (callback.success) {
            this.noteModel = callback.data;
            this.frmNote.reset(this.noteModel);
            return;
        }

        this._snackBarService.open('Error getting note', '', {
            duration: 2000
        });
    }

    cancelClick() {
        this._router.navigate(['/notes']);
    }

    saveClick(frmCmps) {
        if (this.noteKey === '') {
            // Add
            let modelToSave: NoteModel = {
                key: this.commonService.getNewGuid(),
                estateKey: localStorage.getItem('estateKey'),
                noteTypeKey: this.frmNote.value.noteTypeKey,
                unitKey: this.frmNote.value.unit,
                date: this.frmNote.value.date,
                comment: this.frmNote.value.comment
            };

            this.noteService.insertRecord(modelToSave, (e) => this.insertUpdateRecord(e));
            this._router.navigate(['/units']);
        } else {
            // Update
            let modelToSave: NoteModel = {
                key: this.noteKey,
                estateKey: localStorage.getItem('estateKey'),
                noteTypeKey: this.frmNote.value.noteTypeKey,
                unitKey: this.frmNote.value.unit,
                date: this.frmNote.value.date,
                comment: this.frmNote.value.comment
            };

            this.noteService.updateRecord(modelToSave, (e) => this.insertUpdateRecord(e));
            this._router.navigate(['/units']);
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
