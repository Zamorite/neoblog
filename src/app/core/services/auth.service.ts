import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { switchMap, startWith, tap } from 'rxjs/operators';
import { auth } from 'firebase';
import { User } from '../models/user.model';
import { NotificationService } from './notification.service';



@Injectable({
    providedIn: 'root'
})
export class AuthService {
  user: Observable<User>;
  constructor(
    private afa: AngularFireAuth,
    private afs: AngularFirestore,
    private notif: NotificationService,
    private router: Router
) {
    // gets auth data, then gets firestore auth document
    this.user = this.afa.authState.pipe(
        switchMap(
          (user) => {
            if (user) {
              return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
            } else {
              return of(null);
            }
          }
        ),

        // Add these lines to set/read the user data to local storage
        // tap(user => localStorage.setItem('user', JSON.stringify(user))),
        // startWith(JSON.parse(localStorage.getItem('user'))),
    );
}

    googleLogin() {
      const provider = new auth.GoogleAuthProvider();
      return this.oAuthLogin(provider);
    }


    twitterLogin() {
      const provider = new auth.TwitterAuthProvider();
      return this.oAuthLogin(provider);
    }


    FBLogin() {
      const provider = new auth.FacebookAuthProvider();
      return this.oAuthLogin(provider);
    }



    updateUser(user: User) {
      return this.afs.doc(`users/${user.uid}`).update(user);
    }



    async oAuthLogin(provider) {
      try {
        const credential = await this.afa.auth.signInWithPopup(provider);

        await this.setUserDoc(credential.user);
      } catch (err) {
        return this.notif.logError(err.toString().replace('Error: ', ''));
      }
    }


    private setUserDoc(user) {
      const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
      const data: User = {
        uid: user.uid,
        email: user.email,
        photoURL: user.photoURL,
        displayName: user.displayName,
      };

      userRef.set(data, {merge: true});
      this.checkUserDoc(userRef);
    }

    private checkUserDoc(userRef: AngularFirestoreDocument<any>) {

      let field;
      let dept;
      let sch;

      userRef.get().subscribe(
        snap => {
          const usr = snap.data();

          field = usr.field ? usr.field : null;
          dept = usr.department ? usr.department : null;
          sch = usr.school ? usr.school : null;
        }
      ).add(
        () => {
          if (field && dept && sch) {
            return this.router.navigate(['/']);
          } else {
            return this.router.navigate(['/', 'dashboard', 'edit']);
          }
        }
      );
    }


    signOut() {
      this.afa.auth.signOut().then(
        () => {
          localStorage.setItem('user', '');
          this.router.navigate(['/']);
        }
      );
    }
}
