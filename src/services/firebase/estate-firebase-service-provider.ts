import { Injectable } from '@angular/core';

import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { EstateModel } from '../../models';
@Injectable()
export class EstateFirebaseServiceProvider {
    // https://www.youtube.com/watch?v=-GjF9pSeFTs

    private tableName: string = 'estate';

    constructor(private db: AngularFirestore) { }

    public insertRecord(model: EstateModel, callbackMethod) {
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
    public getAll(callbackMethod) {
        let collectionRef = this.db.collection(this.tableName, (ref) => {
            return ref.orderBy('name');
        });
        // var notes = categoryCollectionRef.valueChanges();
        let snapshot = collectionRef.snapshotChanges()
            .map((changes) => {
                return changes.map((snap) => {
                    return snap.payload.doc.data() as EstateModel;
                });
            });
        let subscription = snapshot.subscribe((res) => {
            callbackMethod({ success: true, data: res });
        }, (err) => {
            callbackMethod({ success: false, data: err });
        });
    }

    public updateRecord(model: EstateModel, callbackMethod) {
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
