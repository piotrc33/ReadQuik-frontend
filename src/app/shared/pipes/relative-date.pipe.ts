import { Pipe, PipeTransform } from '@angular/core';
import { formatDistanceToNow } from 'date-fns';

@Pipe({
  name: 'relativeDate'
})
export class RelativeDatePipe implements PipeTransform {

  transform(value: string): string {
    const date = new Date(value);
    return formatDistanceToNow(date, { addSuffix: true });
  }

}
