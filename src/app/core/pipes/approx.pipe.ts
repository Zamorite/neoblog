import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'approx'
})
export class ApproxPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return null;
  }

}
