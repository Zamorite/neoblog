import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import * as firebase from 'firebase';
import { NotificationService } from './notification.service';
import { UtilService } from './util.service';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  uid: string;
  private photoURL: string;


  constructor(
    private auth: AuthService,
    private notif: NotificationService,
    private util: UtilService
  ) {
      this.auth.user.subscribe(
        user => {
          this.uid = user ? user.uid : null;
        }
      );
    }

  setPhotoURL(url: string) {
    this.photoURL = url;
  }

  getPhotoURL() {
    return this.photoURL ? this.photoURL : null;
  }

  resetPhotoURL() {
    this.photoURL = null;
  }





  async upload(file: File, callback?) {
    // Create a root reference
    const storageRef = firebase.storage().ref();

    // Create a reference to 'mountains.jpg'
    const pixRef = storageRef.child(`cover-imgs/${this.uid}_${this.util.randId()}`); //  .${file.type.split('/')[1]}

    // Create file metadata including the content type
    const meta = {
      contentType: file.type,
      size: file.size
    };

    // Upload file and metadata
    const uploadTask = pixRef.put(file, meta);

    // Listen for state changes, errors, and completion of the upload.
    await uploadTask.on('state_changed', snapshot => {

      // Observe state change events such as progress, pause, and resume
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded

      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

      console.log('Upload is ' + progress + '% done');

      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED: // or 'paused'
          console.log('Upload is paused');
          break;
        case firebase.storage.TaskState.RUNNING: // or 'running'
          console.log('Upload is running');
          break;
      }
    }, (error: any) => {
      switch (error.code) {
        case 'storage/unauthorized':
          console.log('User doesn\'t have permission to access the object');
          break;

        case 'storage/canceled':
          console.log('User canceled the upload');
          break;

        case 'storage/unknown':
          console.log('Unknown error occurred, inspect error.serverResponse');
          break;
      }

    }, () => {

      // Handle successful uploads on complete
      uploadTask.snapshot.ref.getDownloadURL()
      .then(
        downloadURL => {
          console.log(`File available at ${downloadURL}`);
          callback(downloadURL);
          this.photoURL = downloadURL;
        }
      )
      .catch(e => this.notif.logError(e));
    });
  }


}
