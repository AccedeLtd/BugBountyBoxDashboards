import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HTTPResponseWrapper } from '../_models';
import { AddDomain } from '../_models/addDomainJson';
import { RequirementLevel } from '../_models/allProjectsResponseJson';
import { CloseProjectJson } from '../_models/closeProjectJson';
import { CreateProjectRequestJson } from '../_models/createProjectRequestJson';
import { HTTPResultWrapper } from '../_models/HTTPResultWrapper';
import { ListCustomerProjectJson } from '../_models/listCustomerProjectJson';

@Injectable({ providedIn: 'root' })
export class CustomerService {

  constructor(private http: HttpClient) { }

  getAuthenticatedCustomer(): Observable<any> {
    let response = this.http.get<HTTPResponseWrapper<any>>(`${environment.customerPortalApiUrl}/v1/Customers/Me`);
    let payload = response.pipe(
      
      map(response => response.result));
    return payload;
  }

  getUser(): Observable<any> {
    // let response = this.http.get<HTTPResponseWrapper<any>>(`${environment.apiUrl}/v1/Users/Me`);
    let response = this.http.get<HTTPResponseWrapper<any>>(`${environment.customerPortalApiUrl}/v1/Customers/Me`);
    let payload = response.pipe(map(response => response.result));

    return payload;
  }

  addDtomainToExistingProject(value:AddDomain):Observable<any>{
    let response = this.http.post<HTTPResponseWrapper<AddDomain>>(`${environment.customerPortalApiUrl}/v1/projects/domains`,value);
    return response;
  }

  getCustomer(): Observable<any> {
    // let response = this.http.get<HTTPResponseWrapper<any>>(`${environment.apiUrl}/v1/Users/Hacker/Me`);
    let response = this.http.get<HTTPResponseWrapper<any>>(`${environment.customerPortalApiUrl}/v1/Customers/Me`);
    let payload = response.pipe(map(response => response.result));

    return payload;
  }

  getCustomers(): Observable<any> {
    // let response = this.http.get<HTTPResponseWrapper<any>>(`${environment.apiUrl}/v1/Users/Hacker/Me`);
    let response = this.http.get<HTTPResponseWrapper<any>>(`${environment.customerPortalApiUrl}/v1/Hackers`);
    let payload = response.pipe(map(response => response.result));

    return payload;
  }

  getCustomerProjects(projectStatus?: number, testType?: number, requirementLevel?: number): Observable<any> {
    let response = this.http.get<HTTPResponseWrapper<ListCustomerProjectJson[]>>(`${environment.customerPortalApiUrl}/v1/Projects/Me${projectStatus === undefined ? '' : `?ProjectStatus=${projectStatus}`}${testType === undefined ? '' : `${(projectStatus === undefined && requirementLevel === undefined) || (projectStatus === undefined) ? '?' : '&'}TestTypeId=${testType}`}${requirementLevel === undefined ? '' : `${projectStatus === undefined && testType === undefined ? '?' : '&'}RequirementLevelId=${requirementLevel}`}`);
    let payload = response.pipe(map(response => response));
    return payload;
  }

  getCustomerProjectsWithQuery(query: any): Observable<any> {
    const params = new HttpParams().set('projectStatus', query.projectStatus);
    let response = this.http.get<HTTPResponseWrapper<any>>(`${environment.customerPortalApiUrl}/v1/Projects/Me`, { params });
    let payload = response.pipe(map(response => response.result));
    return payload;
  }

  updateOrganization(body: any): Observable<any> {
    let response = this.http.put<HTTPResponseWrapper<any>>(`${environment.customerPortalApiUrl}/v1/Customers`, body);
    return response;
  }

  changePassword(body: any): Observable<any> {
    let response = this.http.post<HTTPResponseWrapper<any>>(`${environment.customerPortalApiUrl}/v1/Customers/Password/Change`, body);
    return response;
  }

  uploadAvatar(image: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', image, image.name);

    let response = this.http.post<HTTPResponseWrapper<any>>(`${environment.customerPortalApiUrl}/v1/Customers/Avatar/Update`, formData);
    return response;
  }

  getAllAssetTypes(): Observable<any> {
    let response = this.http.get<HTTPResponseWrapper<RequirementLevel[]>>(`${environment.customerPortalApiUrl}/v1/Projects/assetTypes`);
    return response;
  }

  getProjectLogoUrl(image:File):Observable<any>{
    const formData = new FormData();
    formData.append('file', image, image.name);

    let response = this.http.post<HTTPResponseWrapper<any>>(`${environment.customerPortalApiUrl}/v1/Projects/project-photo`, formData);
    return response;
  }

  createProject(body: CreateProjectRequestJson): Observable<HTTPResponseWrapper<CreateProjectRequestJson>> {
    let response = this.http.post<HTTPResponseWrapper<any>>(`${environment.customerPortalApiUrl}/v1/Projects`, body);
    let payload = response.pipe(map(response => response));

    return payload;
  }

  getCustomerProject(projectId: number): Observable<any> {
    let response = this.http.get<HTTPResponseWrapper<any>>(`${environment.customerPortalApiUrl}/v1/Projects/${projectId}`);
    let payload = response.pipe(map(response => response.result));
    return payload;
  }

  UpdateProject(body: CreateProjectRequestJson): Observable<HTTPResponseWrapper<CreateProjectRequestJson>> {
    let response = this.http.put<HTTPResponseWrapper<any>>(`${environment.customerPortalApiUrl}/v1/Projects`, body);
    let payload = response.pipe(map(response => response));

    return payload;
  }

  deleteCustomerDomain(domainId?: number): Observable<HTTPResultWrapper> {
    let response = this.http.delete<HTTPResultWrapper>(`${environment.customerPortalApiUrl}/v1/Projects/domains?projectDomainId=${domainId}`);
    return response;
  }

  customerMovesDraftToReview(projectId: number): Observable<HTTPResultWrapper> {
    let response = this.http.put<HTTPResultWrapper>(`${environment.customerPortalApiUrl}/v1/Projects/move-to-review/${projectId}`, projectId);
    return response;
  }

  customerMovesReviewToDraft(projectId: number): Observable<HTTPResultWrapper> {
    let response = this.http.put<HTTPResultWrapper>(`${environment.customerPortalApiUrl}/v1/Projects/move-from-review/${projectId}`, projectId);
    return response;
  }

  closeProject(projectId: any): Observable<HTTPResultWrapper> {
    let response = this.http.put<HTTPResultWrapper>(`${environment.customerPortalApiUrl}/v1/Projects/close/${projectId}`, null);
    return response;
  }

  getProjectStats(): Observable<any> {
    let response = this.http.get<HTTPResponseWrapper<any>>(`${environment.customerPortalApiUrl}/v1/Projects/customers/stats`);
    let payload = response.pipe(map(response => response.result));

    return payload;
  }

  getPaymentStats(): Observable<any> {
    let response = this.http.get<HTTPResponseWrapper<any>>(`${environment.customerPortalApiUrl}/v1/Bugs/me/payments/stats`);
    let payload = response.pipe(
      map(response => response.result)
    );

    return payload;
  }

  getPayouts(): Observable<any> {
    let response = this.http.get<HTTPResponseWrapper<any>>(`${environment.customerPortalApiUrl}/v1/Wallets/Transactions/Completed`);
    let payload = response.pipe(
      map(response => response.result)
    );

    return payload;
  }
  
  getTransactions(): Observable<any> {
    let response = this.http.get<HTTPResponseWrapper<any>>(`${environment.customerPortalApiUrl}/v1/Wallets/Transactions`);
    let payload = response.pipe(
      map(response => response.result)
    );

    return payload;
  }
  
  getTransactionsMetrics(): Observable<any> {
    let response = this.http.post<HTTPResponseWrapper<any>>(`${environment.customerPortalApiUrl}/v1/Wallets/Transactions/Metrics`, null);
    let payload = response.pipe(
      map(response => response.result)
    );

    return payload;
  }

  getVulnerabilities(): Observable<any> {
    let response = this.http.get<HTTPResponseWrapper<any>>(`${environment.customerPortalApiUrl}/v1/Bugs/me`);
    let payload = response.pipe(
      map(response => response.result)
    );

    return payload;
  }
  
  getVulnerability(id: any): Observable<any> {
    let response = this.http.get<HTTPResponseWrapper<any>>(`${environment.customerPortalApiUrl}/v1/Bugs/${id}`);
    let payload = response.pipe(
      map(response => response.result)
    );

    return payload;
  }

  topupWallet(body: any): Observable<any> {
    let response = this.http.post<HTTPResponseWrapper<any>>(`${environment.customerPortalApiUrl}/v1/Wallets/Transactions/TopUp`, body);
    let payload = response.pipe(map(response => response.result));

    return payload;
  }

  makePayment(body: any): Observable<any> {
    let response = this.http.put<HTTPResponseWrapper<any>>(`${environment.customerPortalApiUrl}/v1/Bugs/payments`, body);
    let payload = response.pipe(
      map(response => response)
    );

    return payload;
  }

  getAllTestTypes(): Observable<any> {
    let response = this.http.get<HTTPResponseWrapper<RequirementLevel[]>>(`${environment.customerPortalApiUrl}/v1/Projects/testtypes`);
    return response;
  }

  getAllRequirementLevels(): Observable<any> {
    let response = this.http.get<HTTPResponseWrapper<RequirementLevel[]>>(`${environment.customerPortalApiUrl}/v1/Projects/requirementLevels`);
    return response;
  }

  getPaymentMethods() {
    let response = this.http.get<HTTPResponseWrapper<any>>(`${environment.customerPortalApiUrl}/v1/Wallets/PaymentMethods`);
    let payload = response.pipe(map(response => response.result));

    return payload;
  }

  addPaymentMethod(body: any) {
    let response = this.http.post<HTTPResponseWrapper<any>>(`${environment.customerPortalApiUrl}/v1/Wallets/PaymentMethods`, body);
    let payload = response.pipe(map(response => response));

    return payload;
  }

  removePaymentMethod(id: any) {
    let response = this.http.delete<HTTPResponseWrapper<any>>(`${environment.customerPortalApiUrl}/v1/Wallets/PaymentMethods/${id}`);
    let payload = response.pipe(map(response => response.result));

    return payload;
  }

  deleteAccount(body: any) {
    let response = this.http.post<HTTPResponseWrapper<any>>(`${environment.hackerPortalApiUrl}/v1/Customers/Me/Delete`, body);
    let payload = response.pipe(map(response => response.result));

    return payload;
  }
}
