import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'splitIntoArray'
})
export class SplitIntoArrayPipe implements PipeTransform {

  transform(value: string, splitter: string): string[] {
    return value.split(splitter);
  }

}
