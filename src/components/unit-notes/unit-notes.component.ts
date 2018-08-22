import { Component, OnInit, Input } from '@angular/core';
import { CallbackModel, NoteModel, NotesViewModel, NoteTypeModel } from '../../models';
import { Router } from '../../../node_modules/@angular/router';
import { MatSnackBar } from '../../../node_modules/@angular/material';
import { TdLoadingService } from '../../../node_modules/@covalent/core';
import { NoteFirebaseServiceProvider } from '../../services/firebase/note-firebase-service-provider';
import { NoteTypeFirebaseServiceProvider } from '../../services';

@Component({
    selector: 'app-unit-notes',
    templateUrl: './unit-notes.component.html',
    styleUrls: ['./unit-notes.component.scss']
})
export class UnitNotesComponent implements OnInit {
    @Input()
    unitKey: string;
    @Input()
    estateKey: string;
    notes: NoteModel[] = [];
    noteTypes: NoteTypeModel[] = [];
    viewModels: NotesViewModel[] = [];
    public icon: string = 'insert_comment';

    constructor(
        private _snackBarService: MatSnackBar,
        private _router: Router,
        public noteService: NoteFirebaseServiceProvider,
        public noteTypeService: NoteTypeFirebaseServiceProvider,
        private _loadingService: TdLoadingService
    ) {}

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.noteService.getAllForUnit(this.estateKey, this.unitKey, (e) => this.getAllForNoteCallback(e));
    }

    getAllForNoteCallback(callbackModel: CallbackModel) {
        this.notes = [];
        if (callbackModel.success) {
            this.notes = callbackModel.data;
            this.noteTypeService.getAll(this.estateKey, (e) => this.getAllNoteTypesCallback(e));
            return;
        }
        this._snackBarService.open('Error getting notes', '', {
            duration: 2000
        });
    }

    getAllNoteTypesCallback(callbackModel: CallbackModel) {
        this.noteTypes = [];
        if (callbackModel.success) {
            this.noteTypes = callbackModel.data;
            this.buildModel();
            return;
        }
        this._snackBarService.open('Error getting notes', '', {
            duration: 2000
        });
    }

    buildModel() {
        this.viewModels = [];
        this.notes.forEach((unitNote) => {
            let typeDescription = '';
            let comment = '';
            this.noteTypes.forEach((note) => {
                if (note.key === unitNote.noteTypeKey) {
                    typeDescription = note.description;
                    comment = unitNote.comment;
                    return;
                }
            });
            this.viewModels.push({ type: typeDescription, comment: comment, noteKey: unitNote.key });
        });
    }

    detailClick(noteModel: NoteModel) {
        this._router.navigate(['/notes/' + noteModel.key]);
    }
}
