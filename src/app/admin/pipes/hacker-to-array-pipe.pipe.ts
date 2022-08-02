import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hackerToArray'
})
export class HackerToArrayPipePipe implements PipeTransform {

  transform(value: any,filterString:any){
    if(value.length === 0 || filterString === ''){
      return value;
    }

    const Hackers = [];
    for(const hacker of value){
      if(hacker['userName'].toLocaleLowerCase().includes(filterString.toLocaleLowerCase()) || 
         hacker['email'].toLocaleLowerCase().includes(filterString.toLocaleLowerCase()) ||
         hacker['level'].toString().includes(filterString.toLocaleLowerCase())){
        Hackers.push(hacker);
      }
    }  
    return Hackers;

  } 

}
