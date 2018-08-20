import { Component, OnInit } from '@angular/core';
import { NoteModel, CallbackModel } from '../../models';
import { MatSnackBar } from '../../../node_modules/@angular/material';
import { Router } from '../../../node_modules/@angular/router';
import { TdLoadingService } from '../../../node_modules/@covalent/core';
import { NoteFirebaseServiceProvider } from '../../services/firebase/note-firebase-service-provider';

@Component({
    selector: 'app-notes',
    templateUrl: './notes.component.html',
    styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit {
    notes: NoteModel[] = [];
    estateKey: string = '';
    public icon: string = 'build';

    constructor(
        private _snackBarService: MatSnackBar,
        private _router: Router,
        public noteService: NoteFirebaseServiceProvider,
        private _loadingService: TdLoadingService
    ) {}

    ngOnInit() {
        this.estateKey = localStorage.getItem('estateKey');
        this.loadData();
    }

    loadData() {
        this.noteService.getAll(this.estateKey, (e) => this.getAllForNoteCallback(e));
    }

    getAllForNoteCallback(callbackModel: CallbackModel) {
        this.notes = [];
        if (callbackModel.success) {
            this.notes = callbackModel.data;
            return;
        }

        this._snackBarService.open('Error getting notes', '', {
            duration: 2000
        });
    }

    detailClick(noteModel: NoteModel) {
        this._router.navigate(['/notes/' + noteModel.key]);
    }
}
