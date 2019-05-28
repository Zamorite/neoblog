import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  uid: string;

  constructor(
    private afs: AngularFirestore,
    private auth: AuthService) {

    this.auth.user.subscribe(
      usr => {
        if (usr) {
          this.uid = usr.uid;
        }
      }
    );
  }


  getFields(): Observable<any[]> {
    const fieldCollection$ = this.afs.collection('fields').valueChanges();
    return fieldCollection$;
  }




  /*
    Update heartCount for Questions and Answers....
    ...combine the next four methods into two generic ones.
  */

  updatePheartCount(pid: string, uid: string) {

    const heartCollection = this.afs.collection('p_heartCount', ref => {
      return ref.where('pid', '==', pid);
    });

    const p_doc = this.afs.doc(`posts/${pid}`);

    const id = `${pid}_${uid}`;
    const heartRef = heartCollection.doc(id);

    heartRef.get().subscribe(
      doc => {
        if (doc.exists) {
          p_doc.get().subscribe(
            pDoc => {
              p_doc.update({heartCount: pDoc.data().heartCount - 1});
            }
          );

          heartRef.delete();
        } else {
          const p_heart = {id: id, pid: `${pid}`, uid: `${uid}`};
          heartRef.set(p_heart);

          p_doc.get().subscribe(
            pDoc => {
              p_doc.update({heartCount: pDoc.data().heartCount + 1});
            }
          );
        }
      }
    );
  }

  updateCheartCount(cid: string, uid: string) {

    const heartCollection = this.afs.collection('c_heartCount', ref => {
      return ref.where('cid', '==', cid);
    });

    const c_doc = this.afs.doc(`comments/${cid}`);

    const id = `${cid}_${uid}`;
    const heartRef = heartCollection.doc(id);

    heartRef.get().subscribe(
      doc => {
        if (doc.exists) {
          c_doc.get().subscribe(
            cDoc => {
              c_doc.update({heartCount: cDoc.data().heartCount - 1});
            }
          );

          heartRef.delete();
        } else {
          const c_heart = {id: id, cid: `${cid}`, uid: `${uid}`};
          heartRef.set(c_heart);

          c_doc.get().subscribe(
            cDoc => {
              c_doc.update({heartCount: cDoc.data().heartCount + 1});
            }
          );
        }
      }
    );
  }

  p_hearted(pid: string, uid: string): boolean {
    const id = `${pid}_${uid}`;
    const heartRef = this.afs.collection('posts').doc(id);
    let hearted;

    heartRef.get().subscribe(
      doc => {
        hearted = doc.exists;
      }
    );
    return hearted;
  }

  c_hearted(cid: string, uid: string): boolean {
    const id = `${cid}_${uid}`;
    const heartRef = this.afs.collection('comments').doc(id);
    let hearted;

    heartRef.get().subscribe(
      doc => {
        hearted = doc.exists;
      }
    );
    return hearted;
  }


  updateUserDoc(user) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const data: User = user;
    return userRef.set(data, {merge: true});
  }

}
