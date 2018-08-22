import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { NoteModel } from '../../models';

@Injectable()
export class NoteFirebaseServiceProvider {
    // https://www.youtube.com/watch?v=-GjF9pSeFTs

    private tableName: string = 'note';

    constructor(private db: AngularFirestore) {}

    public insertRecord(model: NoteModel, callbackMethod) {
        this.db
            .collection(this.tableName)
            .doc(model.key)
            .set(model)
            .then((docRef) => {
                // console.log(docRef);
                callbackMethod({ success: true, data: undefined });
            })
            .catch((error) => {
                // console.log(error);
                callbackMethod({ success: false, data: undefined });
            });
    }

    public getRecord(key, callbackMethod) {
        let docRef = this.db.doc(this.tableName + '/' + key);
        let valueChangesSub = docRef.valueChanges();

        let subscription = valueChangesSub.subscribe(
            (res) => {
                callbackMethod({ success: true, data: res });
                subscription.unsubscribe();
            },
            (err) => {
                callbackMethod({ success: false, data: err });
                subscription.unsubscribe();
            }
        );
    }

    public getAll(estateKey: string, callbackMethod) {
        let collectionRef = this.db.collection(this.tableName, (ref) => {
            return ref.where('estateKey', '==', estateKey).orderBy('comment');
        });
        // var notes = categoryCollectionRef.valueChanges();
        let snapshot = collectionRef.snapshotChanges().map((changes) => {
            return changes.map((snap) => {
                return snap.payload.doc.data() as NoteModel;
            });
        });
        let subscription = snapshot.subscribe(
            (res) => {
                callbackMethod({ success: true, data: res });
            },
            (err) => {
                callbackMethod({ success: false, data: err });
            }
        );
    }

    public getAllForUnit(estateKey: string, unitKey: string, callbackMethod) {
        let collectionRef = this.db.collection(this.tableName, (ref) => {
            return ref
                .where('estateKey', '==', estateKey)
                .where('unitKey', '==', unitKey)
                .orderBy('comment');
        });
        // var notes = categoryCollectionRef.valueChanges();
        let snapshot = collectionRef.snapshotChanges().map((changes) => {
            return changes.map((snap) => {
                return snap.payload.doc.data() as NoteModel;
            });
        });
        let subscription = snapshot.subscribe(
            (res) => {
                callbackMethod({ success: true, data: res });
            },
            (err) => {
                callbackMethod({ success: false, data: err });
            }
        );
    }

    public getAllForNoteNumberOnceOff(estateKey: string, unit, callbackMethod) {
        let collectionRef = this.db.collection(this.tableName, (ref) => {
            return ref.where('estateKey', '==', estateKey).where('unitKey', '==', unit);
        });
        // var notes = categoryCollectionRef.valueChanges();
        let snapshot = collectionRef.snapshotChanges().map((changes) => {
            return changes.map((snap) => {
                return snap.payload.doc.data() as NoteModel;
            });
        });
        let subscription = snapshot.subscribe(
            (res) => {
                callbackMethod({ success: true, data: res });
                subscription.unsubscribe();
            },
            (err) => {
                callbackMethod({ success: false, data: err });
                subscription.unsubscribe();
            }
        );
    }

    public updateRecord(model: NoteModel, callbackMethod) {
        let docRef = this.db.doc(this.tableName + '/' + model.key);
        docRef
            .set(model)
            .then((ok) => {
                callbackMethod({ success: true, data: ok });
            })
            .catch((err) => {
                callbackMethod({ success: false, data: err });
            });
    }

    public deleteRecord(key, callbackMethod) {
        let docRef = this.db.doc(this.tableName + '/' + key);
        docRef
            .delete()
            .then((ok) => {
                callbackMethod({ success: true, data: ok });
            })
            .catch((err) => {
                callbackMethod({ success: false, data: err });
            });
    }
}