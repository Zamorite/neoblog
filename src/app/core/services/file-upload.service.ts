import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  uid: string;
  private photoURL: string;


  constructor(
    private auth: AuthService
  ) {
      this.auth.user.subscribe(
        user => {
          this.uid = user.uid;
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


}
