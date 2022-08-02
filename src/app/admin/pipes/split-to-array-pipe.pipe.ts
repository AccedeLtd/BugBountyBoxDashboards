import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'splitToArray'
})
export class SplitToArrayPipePipe implements PipeTransform {
  transform(value: any,filterString:string){
    if(value.length === 0 || filterString === ''){
      return value;
    }

    const Projects = [];
    for(const project of value){
      if(project['title'].toLocaleLowerCase().includes(filterString.toLocaleLowerCase()) || 
         project['description'].toLocaleLowerCase().includes(filterString.toLocaleLowerCase()) ||
         project['bounty'].toString().includes(filterString) ||
         project['customer']['businessName'].toLocaleLowerCase().includes(filterString.toLocaleLowerCase())){
        Projects.push(project);
      }
    }
    return Projects;

  }  
}
