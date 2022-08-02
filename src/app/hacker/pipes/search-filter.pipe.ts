import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchFilter'
})
export class SearchFilterPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!value) return null;
    if (!args) return value;

    if (args instanceof Array) {  
      return value.filter(function (data: any) {
        let result = args.every((o: any) => JSON.stringify(data).toLowerCase().includes(o.toLowerCase()));
        return result;
      });
    } else {
      args = args.toLowerCase();
  
      return value.filter(function (data: any) {
        return JSON.stringify(data).toLowerCase().includes(args);
      });      
    }
  }

}
