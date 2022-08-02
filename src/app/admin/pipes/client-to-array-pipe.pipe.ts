import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'clientToArray'
})
export class ClientToArrayPipePipe implements PipeTransform {

  transform(value: any,filterString:string){
    if(value.length === 0 || filterString === ''){
      return value;
    }

    const Hackers = [];
    for(const hacker of value){
      if(hacker['businessName'].toLocaleLowerCase().includes(filterString.toLocaleLowerCase()) || 
         hacker['email'].toLocaleLowerCase().includes(filterString.toLocaleLowerCase())){
        Hackers.push(hacker);  
      }
    }  
    return Hackers;

  } 
}
