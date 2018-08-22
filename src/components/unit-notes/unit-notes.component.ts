import { Component, OnInit, Input } from '@angular/core';
import { CallbackModel, NoteModel } from '../../models';
import { Router } from '../../../node_modules/@angular/router';
import { MatSnackBar } from '../../../node_modules/@angular/material';
import { TdLoadingService } from '../../../node_modules/@covalent/core';
import { NoteFirebaseServiceProvider } from '../../services/firebase/note-firebase-service-provider';

@Component({
    selector: 'app-unit-notes',
    templateUrl: './unit-notes.component.html',
    styleUrls: ['./unit-notes.component.scss']
})
export class UnitNotesComponent implements OnInit {
    @Input() unitKey: string;
    @Input() estateKey: string;
    notes: NoteModel[] = [];
    public icon: string = 'insert_comment';

    constructor(
        private _snackBarService: MatSnackBar,
        private _router: Router,
        public noteService: NoteFirebaseServiceProvider,
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
            return;
        }
console.log(callbackModel.data);
        this._snackBarService.open('Error getting notes', '', {
            duration: 2000
        });
    }

    detailClick(noteModel: NoteModel) {
        this._router.navigate(['/notes/' + noteModel.key]);
    }
}
