import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'addvulnToArray'
})
export class AddvulnToArrayPipePipe implements PipeTransform {

  transform(value: any,filterString:string){
    if(value.length === 0 || filterString === ''){
      return value;
    }

    const Hackers = [];
    for(const hacker of value){
      if(hacker['type'].toLocaleLowerCase().includes(filterString.toLocaleLowerCase())){
        Hackers.push(hacker);
      }
    }  
    return Hackers;

  } 

}
