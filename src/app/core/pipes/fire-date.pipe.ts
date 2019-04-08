import { Inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';
import {formatDate} from '@angular/common';
import {firestore} from 'firebase/app';
import Timestamp = firestore.Timestamp;

@Pipe({
  name: 'fireDate'
})
export class FireDatePipe implements PipeTransform {

  constructor(@Inject(LOCALE_ID) private locale: string) {
  }

  transform(timestamp: Timestamp, format?: string): string {
    return formatDate(timestamp.toDate(), format || 'medium', this.locale);
  }

}
