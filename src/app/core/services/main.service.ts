import { Injectable } from '@angular/core';
import { Post } from '../models/post.model';
import { Observable } from 'rxjs';
import { Comment } from '../models/comment.model';
import { DataService } from './data.service';
import { AuthService } from './auth.service';
import { User } from '../models/user.model';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  baseUrl = 'https://neoquora.com';
  shareReq = 'Hello! Check out this post from NeoQuora';

  user: User;

  selectedPosts: Post[];

  fields: Observable<any[]>;

  comments: Observable<Comment[]>;

  constructor(
    public data: DataService,
    public auth: AuthService,
    public notif: NotificationService) {

    auth.user.subscribe(
      user => this.user = user
    );

    this.fields = this.data.getFields();
  }


  getDate(): Date {
    const date: Date = new Date(Date.now());
    return date;
  }


  toggleAns(id: string, domain: string) {
    if (this.user) {
      const element_id = `ans_${domain}_${id}`;
      const text_id = `ans_txt_${domain}_${id}`;
      const icon_id = `ans_icon_${domain}_${id}`;

      const elements = document.querySelectorAll(`.ans_${domain}`);
      const texts = document.querySelectorAll(`.ans_txt_${domain}_`);
      const icons = document.querySelectorAll(`.ans_icon_${domain}_`);

      for (let idx = 0; idx < elements.length; idx++) {
        const element = elements[idx];

        if (element.id === element_id) {
          element.classList.toggle('d-none');
        } else {
          element.classList.add('d-none');
        }
      }

      for (let idx = 0; idx < texts.length; idx++) {
        const text = texts[idx];

        if (text.id === text_id) {
          text.innerHTML = text.innerHTML === 'comment' ? 'Drop Pen' : 'comment';
        } else {
          text.innerHTML = 'comment';
        }
      }

      for (let idx = 0; idx < icons.length; idx++) {
        const icon = icons[idx];

        if (icon.id === icon_id) {
          if (icon.classList.contains('icon-pencil')) {
            icon.classList.replace('icon-pencil', 'icon-pencil-alt2');
          } else if (icon.classList.contains('icon-pencil-alt2')) {
            icon.classList.replace('icon-pencil-alt2', 'icon-pencil');
          }
        } else {
          icon.classList.replace('icon-write', 'icon-pencil');
        }
      }

    } else {
      this.notif.noAuth('comment Posts');
    }
  }


  toggleImgModal(src: string, alt?: string) {
    document.querySelector('#img-modal').classList.toggle('d-none');
    const img = document.querySelector('#modal-img');
    img.setAttribute('src', src);
    if (alt) {
      img.setAttribute('alt', alt);
    }
  }

  closeImgModal() {
    const modal = document.querySelector('#img-modal');
    modal.classList.toggle('d-none');
    console.log('⚠ Closed modal');
  }


  toggleAsk() {
    if (this.user) {
      document.querySelector('#ask').classList.toggle('d-none');
    } else {
      this.notif.noAuth('Ask Posts');
    }

    // const modal = document.querySelector('#myModal');
    // // console.log(`Has d-none: ${modal.classList.contains('d-none')}`);

    // modal.classList.toggle('d-none');
  }

  closeAsk() {
    const modal = document.querySelector('#ask');
    modal.classList.toggle('d-none');
    console.log('⚠ Closed modal');

  }


  toggleMore(id: string, domain: string) {
    const element_id = `more_${domain}_${id}`;
    const text_id = `more_txt_${domain}_${id}`;
    const icon_id = `more_icon_${domain}_${id}`;

    const elements = document.querySelectorAll(`.more_${domain}`);
    const texts = document.querySelectorAll(`.more_txt_${domain}_`);
    const icons = document.querySelectorAll(`.more_icon_${domain}_`);

    for (let idx = 0; idx < elements.length; idx++) {
      const element = elements[idx];

      if (element.id === element_id) {
        element.classList.toggle('d-none');
      } else {
        element.classList.add('d-none');
      }
    }

    for (let idx = 0; idx < texts.length; idx++) {
      const text = texts[idx];

      if (text.id === text_id) {
        text.innerHTML = text.innerHTML === 'More' ? 'Less' : 'More';
      } else {
        text.innerHTML = 'More';
      }
    }

    for (let idx = 0; idx < icons.length; idx++) {
      const icon = icons[idx];

      if (icon.id === icon_id) {
        if (icon.classList.contains('icon-angle-double-down')) {
          icon.classList.replace('icon-angle-double-down', 'icon-angle-double-up');
        } else if (icon.classList.contains('icon-angle-double-up')) {
          icon.classList.replace('icon-angle-double-up', 'icon-angle-double-down');
        }
      } else {
        icon.classList.replace('icon-angle-double-up', 'icon-angle-double-down');
      }
    }
  }


  togglePreview(id: string, domain: string) {
    const element_id = `prev_${domain}_${id}`;
    const text_id = `prev_txt_${domain}_${id}`;
    const icon_id = `prev_icon_${domain}_${id}`;

    const elements = document.querySelectorAll(`.prev_${domain}`);
    const texts = document.querySelectorAll(`.prev_txt_${domain}_`);
    const icons = document.querySelectorAll(`.prev_icon_${domain}_`);

    for (let idx = 0; idx < elements.length; idx++) {
      const element = elements[idx];

      if (element.id === element_id) {
        element.classList.toggle('d-none');
      } else {
        element.classList.add('d-none');
      }
    }

    for (let idx = 0; idx < texts.length; idx++) {
      const text = texts[idx];

      if (text.id === text_id) {
        text.innerHTML = text.innerHTML === 'Preview' ? 'Close' : 'Preview';
      } else {
        text.innerHTML = 'Preview';
      }
    }

    for (let idx = 0; idx < icons.length; idx++) {
      const icon = icons[idx];

      if (icon.id === icon_id) {
        if (icon.classList.contains('icon-eye')) {
          icon.classList.replace('icon-eye', 'icon-close');
        } else if (icon.classList.contains('icon-close')) {
          icon.classList.replace('icon-close', 'icon-eye');
        }
      } else {
        icon.classList.replace('icon-close', 'icon-eye');
      }
    }

  }


  toggleUpload(id: string, domain: string) {
    const element_id = `upload_${domain}_${id}`;
    const text_id = `upload_txt_${domain}_${id}`;
    const icon_id = `upload_icon_${domain}_${id}`;

    const elements = document.querySelectorAll(`.upload_${domain}`);
    const texts = document.querySelectorAll(`.upload_txt_${domain}`);
    const icons = document.querySelectorAll(`.upload_icon_${domain}`);

    for (let idx = 0; idx < elements.length; idx++) {
      const element = elements[idx];

      if (element.id === element_id) {
        element.classList.toggle('d-none');
      } else {
        element.classList.add('d-none');
      }
    }

    for (let idx = 0; idx < texts.length; idx++) {
      const text = texts[idx];

      if (text.id === text_id) {
        text.innerHTML = text.innerHTML === 'Add Image' ? 'Close' : 'Add Image';
      } else {
        text.innerHTML = 'Add Image';
      }
    }

    for (let idx = 0; idx < icons.length; idx++) {
      const icon = icons[idx];

      if (icon.id === icon_id) {
        if (icon.classList.contains('icon-image')) {
          icon.classList.replace('icon-image', 'icon-close');
        } else if (icon.classList.contains('icon-close')) {
          icon.classList.replace('icon-close', 'icon-image');
        }
      } else {
        icon.classList.replace('icon-close', 'icon-image');
      }
    }

  }
}
