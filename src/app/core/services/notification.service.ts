import { Injectable } from '@angular/core';
import { Notification } from '../models/notification.model';
import { Observable, of } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { NotificationsService } from 'angular2-notifications';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  uid: string;

  constructor(
    private notif: NotificationsService,
    private afs: AngularFirestore
  ) {}

  logError(message: string, error?: any) {
    this.notif.error(error ? message : 'Oops!', error ? error : message);
  }

  success(message: string) {
    this.notif.success('Great!', message);
    console.log(message);
  }

  noAuth(action?: string) {
    this.notif.error('Authentication Required!', `You must be signed in to ${action ? action.toLowerCase() : 'do that'}.`);
  }

  setNotification(notif: Notification, uid: string) {
    notif.id = this.afs.createId();

    this.afs.doc(`users/${uid}`).collection('notifications').doc(notif.id).set(notif).then(
      () => {
        console.log(`Notification set successfully`, `id: ${notif.id}`);
      }
    )
    .catch(
      err => {
        console.log(`Something's not right: ${err}`);
      }
    );
  }

  getNotifications(uid: string): Observable<Notification[]> {
    const notifPath = this.afs.collection<Notification>('notifications', ref => {
      return ref.where('uid', '==', uid);
    });
    return notifPath.valueChanges();
  }

  deleteNotification(id: string) {
    const notifPath = this.afs.doc(`notifications/${id}`);

    return notifPath.delete();
  }

  resolveSubscription(sub: any): Promise<any> {
    return new Promise((resolve, reject) => {
      sub.subscribe(
        success => resolve(success)
      );
    });
  }

  async notifyAuthor(pid: string) {
    // author uid
    let cid;
    let pTitle;
    let username;

    // get author and post title
    const qSub = await this.resolveSubscription(this.afs.doc(`posts/${pid}`).get());

    if (qSub.exists) {
      const post = qSub.data();
      console.log(`Author id: ${post.author}`);
      cid = post.author;
      pTitle = post.title;
    } else {
      console.log('Could not get post...');
    }

    // current user
    const uSub = await this.resolveSubscription(this.afs.doc(`users/${cid}`).get());

    if (uSub.exists) {
      username = uSub.data().displayName;
    }

    if (cid) {
      const notif: Notification = {
        uid: cid,
        icon: 'info',
        summary: 'New Comment',
        link: pid
      };

      notif.id = this.afs.createId();
      const ansAuth = username ? username : 'A user';
      notif.details = ansAuth + ` just commented on your post - ${pTitle}. Check it out`;

      // add the notification to user's document...

      this.afs.collection('notifications').doc(notif.id).set(notif)
      .then(
        () => {
          console.log('Document set successfully!');
        }
      )
      .catch(
        err => {
          console.log(`Error setting document - ${err}`);
        }
      );

    } else {
      console.log('Something went wrong with author id...');
    }
  }
}
