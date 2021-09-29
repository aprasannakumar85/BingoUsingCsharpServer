import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'trimFirst'
})
export class TrimFirstPipe implements PipeTransform {

  transform(value: string): string {
    return value.substring(1,value.length);
  }

}
