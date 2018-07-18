import { Injectable } from '@angular/core';

import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { ApprovalTypeModel } from '../../models';
@Injectable()
export class ApprovalTypeFirebaseServiceProvider {
    // https://www.youtube.com/watch?v=-GjF9pSeFTs

    private tableName: string = 'approvalType';

    constructor(private db: AngularFirestore) { }

    public insertRecord(model: ApprovalTypeModel, callbackMethod) {
        this.db.collection(this.tableName).doc(model.key).set(model).then((docRef) => {
            // console.log(docRef);
            callbackMethod({ success: true, data: undefined });
        }).catch((error) => {
            // console.log(error);
            callbackMethod({ success: false, data: undefined });
        });
    }

    public getRecord(key, callbackMethod) {
        let docRef = this.db.doc(this.tableName + '/' + key);
        let valueChangesSub = docRef.valueChanges();

        let subscription = valueChangesSub.subscribe((res) => {
            callbackMethod({ success: true, data: res });
            subscription.unsubscribe();
        }, (err) => {
            callbackMethod({ success: false, data: err });
            subscription.unsubscribe();
        });
    }

    public getAll(estateKey: string, callbackMethod) {
        let collectionRef = this.db.collection(this.tableName, (ref) => {
            return ref.where('estateKey', '==', estateKey).orderBy('name');
        });
        // var notes = categoryCollectionRef.valueChanges();
        let snapshot = collectionRef.snapshotChanges()
            .map((changes) => {
                return changes.map((snap) => {
                    return snap.payload.doc.data() as ApprovalTypeModel;
                });
            });
        let subscription = snapshot.subscribe((res) => {
            callbackMethod({ success: true, data: res });
        }, (err) => {
            callbackMethod({ success: false, data: err });
        });
    }

    public getAllForEstate(estateKey, callbackMethod) {
        let collectionRef = this.db.collection(this.tableName, (ref) => {
            return ref.where('estateKey', '==', estateKey).orderBy('name');
        });
        // var notes = categoryCollectionRef.valueChanges();
        let snapshot = collectionRef.snapshotChanges()
            .map((changes) => {
                return changes.map((snap) => {
                    return snap.payload.doc.data() as ApprovalTypeModel;
                });
            });
        let subscription = snapshot.subscribe((res) => {
            callbackMethod({ success: true, data: res });
        }, (err) => {
            callbackMethod({ success: false, data: err });
        });
    }

    public updateRecord(model: ApprovalTypeModel, callbackMethod) {
        let docRef = this.db.doc(this.tableName + '/' + model.key);
        docRef.set(model).then((ok) => {
            callbackMethod({ success: true, data: ok });
        }).catch((err) => {
            callbackMethod({ success: false, data: err });
        });
    }

    public deleteRecord(key, callbackMethod) {
        let docRef = this.db.doc(this.tableName + '/' + key);
        docRef.delete().then((ok) => {
            callbackMethod({ success: true, data: ok });
        }).catch((err) => {
            callbackMethod({ success: false, data: err });
        });
    }
}
