import { Component, OnInit } from '@angular/core';
import { NoteTypeModel, CallbackModel } from '../../models';
import { Router } from '../../../node_modules/@angular/router';
import { MatSnackBar } from '../../../node_modules/@angular/material';
import { TdLoadingService } from '../../../node_modules/@covalent/core';
import { NoteTypeFirebaseServiceProvider } from '../../services';

@Component({
    selector: 'app-note-types',
    templateUrl: './note-types.component.html',
    styleUrls: ['./note-types.component.scss']
})
export class NoteTypesComponent implements OnInit {
    noteTypes: NoteTypeModel[] = [];
    public icon: string = 'insert_comment';
    estateKey: string = '';

    constructor(
        private _snackBarService: MatSnackBar,
        private _router: Router,
        public noteTypeService: NoteTypeFirebaseServiceProvider,
        private _loadingService: TdLoadingService
    ) {}

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        let estateKey = localStorage.getItem('estateKey');
        this.noteTypeService.getAll(estateKey, (e) => this.getAllForNoteTypeCallback(e));
    }

    getAllForNoteTypeCallback(callbackModel: CallbackModel) {
        this.noteTypes = [];
        if (callbackModel.success) {
            this.noteTypes = callbackModel.data;
            return;
        }

        this._snackBarService.open('Error getting notes', '', {
            duration: 2000
        });
    }

    detailClick(noteTypeModel: NoteTypeModel) {
        this._router.navigate(['/note-types/' + noteTypeModel.key]);
    }
}
