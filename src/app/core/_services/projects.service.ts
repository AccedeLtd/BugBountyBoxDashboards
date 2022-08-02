import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { HTTPResponseWrapper } from '../_models';
import { CreateProjectRequestJson } from '../_models/createProjectRequestJson';
import { ListCustomerProjectJson } from '../_models/listCustomerProjectJson';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  
  constructor(
    private http: HttpClient,
  ) {

  }
  
  getProjects(body: any): Observable<any>{
    // const params = new HttpParams().set('q', query.q).set('from', query.from);
    // const headers = new HttpHeaders().set('Access-Control-Allow-Origin', '*');
    let response = this.http.get(`${environment.projectServiceApiUrl}/projects`);
    // let payload = response.pipe(map(response => response.result));

    return response;
  }
  
  getProject(id: number): Observable<any>{
    let response = this.http.get<HTTPResponseWrapper<ListCustomerProjectJson>>(`${environment.projectServiceApiUrl}/v1/Projects/${id}`);
    let payload = response.pipe(map(response => response.result));
    return payload;
  }
  
  createProject(body: CreateProjectRequestJson): Observable<HTTPResponseWrapper<CreateProjectRequestJson>>{
    let response = this.http.post<HTTPResponseWrapper<any>>(`${environment.projectServiceApiUrl}/v1/Projects`, body);
    let payload = response.pipe(map(response => response));

    return payload;
  }
  
  getTestingTypes(): Observable<any>{
    let response = this.http.get<HTTPResponseWrapper<any>>(`${environment.projectServiceApiUrl}/v1/TestTypes`);
    let payload = response.pipe(
      map(response => response.result.data));

    return payload;
  }

  getRequirementLevels(): Observable<any>{
    let response = this.http.get<HTTPResponseWrapper<any>>(`${environment.projectServiceApiUrl}/v1/RequirementLevels`);
    let payload = response.pipe(
      map(response => response.result.data));

    return payload;  
  }
  
  getProjectStats(customerId: any): Observable<any>{
    let response = this.http.get<HTTPResponseWrapper<any>>(`${environment.projectServiceApiUrl}/v1/Projects/customers/${customerId}/stats`);
    let payload = response.pipe(
      map(response => response.result)
    );

    return payload;  
  }
  
  getBugs(): Observable<any>{
    let response = this.http.get<HTTPResponseWrapper<any>>(`${environment.projectServiceApiUrl}/v1/Bugs`);
    let payload = response.pipe(
      map(response => response.result)
    );

    return payload;  
  }
}
