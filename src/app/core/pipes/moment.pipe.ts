import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'moment'
})
export class MomentPipe implements PipeTransform {

  transform(date: any, format?: any): any {
    if (format) {
      return moment(date).format(format);
    } else {
      return moment(date).fromNow();
    }
  }

}
