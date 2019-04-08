import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'avatar'
})
export class AvatarPipe implements PipeTransform {

  transform(photoURL: string): any {
    return photoURL.includes('graph.facebook.com') ? `${photoURL}?type=large` : photoURL;
  }

}
