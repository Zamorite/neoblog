import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(
    private afs: AngularFirestore
    ) { }

  getUser(uid: string): Observable<User> {
    const user$: Observable<User> = <Observable<User>> this.afs.doc(`users/${uid}`).valueChanges();

    return user$;
  }
}
