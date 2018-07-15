import { Component, Inject, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { EstateModel, CallbackModel } from '../../models';
import { EstateFirebaseServiceProvider } from '../../services';
import { SgNotificationService } from '../../components';

@Component({
  selector: 'app-estate-dialog',
  templateUrl: './estate-dialog.component.html',
  styleUrls: ['./estate-dialog.component.scss']
})
export class EstateDialogComponent {
  // @Output() newMarkerPosition = new EventEmitter<{ lat: string, lng: string }>();
  private incommingData: string = '';
  private estates: EstateModel[] = [];
  private estateKey = undefined;

  constructor(
    public dialogRef: MatDialogRef<EstateDialogComponent>,
    private estateService: EstateFirebaseServiceProvider,
    private _notificationService: SgNotificationService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.incommingData = data;

    this.getAllEstates();
  }

  getAllEstates() {
    this.estateService.getAll((e) => this.getAllEstatesCallback(e));
  }

  getAllEstatesCallback(callbackModel: CallbackModel) {
    if (callbackModel.success) {
      this.estates = callbackModel.data;
    } else {
      this._notificationService.displayMessage(callbackModel.data.message);
    }
  }

  onNoClick(): void {
    // this.dialogRef.close({ estateKey: this.estateKey });
  }

  okClick() {
    this.dialogRef.close(this.estateKey);
  }
}
