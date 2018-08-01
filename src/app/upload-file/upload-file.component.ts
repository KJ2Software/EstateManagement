import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { MatSnackBar } from '../../../node_modules/@angular/material';
import { Router, ActivatedRoute } from '../../../node_modules/@angular/router';
import { ApprovalItemFirebaseServiceProvider, CommonService } from '../../services';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { CallbackModel, ApprovalItemModel } from '../../models';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})
export class UploadFileComponent implements OnInit {
  private subscriptions: any[] = [];
  private approvalItemKey: string;
  private approvalKey: string;
  private urlToSave: string = '';


  @Output() uploadedUrlChange = new EventEmitter<{ id: string, imageUrl: string }>();
  @Input() showDrowZone: boolean = false;
  @Input() showImage: boolean = true;
  // Main task
  task: AngularFireUploadTask;
  // Progress monitoring
  percentage: Observable<number>;
  snapshot: Observable<any>;
  // Download URL
  downloadURL: Observable<string>;
  // State for dropzone CSS toggling
  isHovering: boolean;
  imageId: string = '';

  constructor(private _snackBarService: MatSnackBar, private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private approvalItemService: ApprovalItemFirebaseServiceProvider,
    private storage: AngularFireStorage,
    private commonSerivce: CommonService) { }

  ngOnInit() {
    this.imageId = '';

    this.subscriptions.push(this._activatedRoute.params.subscribe((params) => {
      /* tslint:disable:no-string-literal */
      this.approvalItemKey = params['approvalItemKey'];
      this.approvalKey = params['approvalKey'];
    }));

  }

  toggleHover(event: boolean) {
    this.isHovering = event;
  }

  startUpload(event: FileList) {
    // The File object
    const file = event.item(0);

    console.log('startUpload');


    // Client-side validation example
    // if (file.type.split('/')[0] !== 'image') {

    if (file.type.split('/')[1] !== 'pdf') {
      this._snackBarService.open('unsupported file type :( ', undefined, { duration: 3000 });
      return;
    }

    // The storage path
    this.imageId = this.commonSerivce.getNewGuid();
    const path = 'approvalItems/' + this.imageId;

    // Totally optional metadata
    const customMetadata = { app: 'FirebaseFeatures' };

    // The main task
    this.task = this.storage.upload(path, file, { customMetadata });

    // Progress monitoring
    this.percentage = this.task.percentageChanges();
    this.snapshot = this.task.snapshotChanges().pipe(
      tap((snap) => {

        if (snap.bytesTransferred === snap.totalBytes) {
          // Update firestore on completion
          console.log(' Update firestore on completion');

        }
      })
    );
    // The file's download URL
    this.downloadURL = this.task.downloadURL().pipe(
      tap((res) => {
        this.uploadedUrlChange.emit({ id: this.imageId, imageUrl: res });
        this.urlToSave = res;
        console.log('urlToSave');
        console.log(res);

        this.saveUrl();
      }
      ));
  }

  // Determines if the upload task is active
  isActive(snapshot) {
    return snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes;
  }

  backClick() {
    this._router.navigate(['/approvals/' + this.approvalKey + '/approval-items']);
  }

  saveUrl() {
    // First we have to get the object
    this.approvalItemService.getRecord(this.approvalItemKey, (e) => this.getCallback(e));
  }

  getCallback(callbackModel: CallbackModel) {
    if (!callbackModel.success) {
      this._snackBarService.open('Error getting approval Item', '', {
        duration: 2000
      });
      return;
    }
    let approvalItemModel: ApprovalItemModel = callbackModel.data;
    approvalItemModel.attachmentLink = this.urlToSave;

    this.approvalItemService.updateRecord(approvalItemModel, (e) => this.updateCallback(e));

  }

  updateCallback(callbackModel: CallbackModel){
    if (!callbackModel.success) {
      this._snackBarService.open('Error saving approval Item', '', {
        duration: 2000
      });
      return;
    }

    this._snackBarService.open('File saved', '', {
      duration: 2000
    });
    this.backClick();
  }
}
