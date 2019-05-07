import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { Post } from '../core/models/post.model';
import { FormBuilder, Validators } from '@angular/forms';
import { PostService } from '../core/services/posts.service';
import { NotificationService } from '../core/services/notification.service';
import { FileUploadService } from '../core/services/file-upload.service';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-write',
  templateUrl: './write.component.html',
  styleUrls: ['./write.component.scss']
})
export class WriteComponent implements OnInit {

  pix: File;
  pixURL: any;
  pixErr: string;

  post: Post = {
    title: null,
    text: null,
    tags: [],
    image: null,
    heartCount: 0
  };

  tags: string;
  hide = true;
  err: string = null;

  constructor(
    private fb: FormBuilder,
    private ps: PostService,
    public auth: AuthService,
    private notif: NotificationService,
    private fus: FileUploadService
  ) {
  }


  postForm = this.fb.group(
    {
      title: ['', Validators.compose([Validators.minLength(10), Validators.required])],
      content: ['', Validators.compose([Validators.minLength(1250), Validators.required])],
      coverImage: ['', Validators.required]
    }
  );


  ngOnInit() {
  }


  setPix(event) {
    this.pix = (document.querySelector('#pix') as HTMLInputElement).files[0];

    const fr = new FileReader();

    fr.addEventListener('loadend', () => this.pixURL = fr.result);
    fr.readAsDataURL(this.pix);

    console.log(this.pixURL);

  }

  getDate() {
    return new Date();
  }


  updateTags() {
    this.post.tags = this.tags.split(',');
    this.post.tags.forEach(t => t.trim());
  }


  postArticle() {
    this.fus.upload(this.pix,
      (photoURL) => {

        console.log('hello ' + photoURL);


        this.post.text = this.postForm.get('content').value;
        this.post.image = photoURL;

        this.ps.addPost(this.post)
        .then(
          () => {
            this.notif.success('Article Posted Successfully.');
            this.hide = true;
            this.postForm.reset();
            this.pix = this.pixURL = this.tags = null;
            this.post.tags = [];
          })
        .catch(e => this.notif.logError(e));
      }
    );
  }

  previewPost() {
    this.post.text = this.postForm.get('content').value;
    this.hide = false;
  }

  hideModal() {
    this.hide = true;
  }

}
