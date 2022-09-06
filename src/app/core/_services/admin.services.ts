import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HTTPResponseWrapper } from '../_models';
import {
  Customer,
  ListCustomerProjectJson,
} from '../_models/listCustomerProjectJson';
import { map, Observable } from 'rxjs';
import { AddReviewJson } from '../_models/addReviewJson';
import { HTTPResultWrapper } from '../_models/HTTPResultWrapper';
import { BugReviewJsonList, Hacker } from '../_models/BugReviewJsonList';
import { AddBugReviewJSON } from '../_models/addBugReviewJson';
import { AuthenticatedAdminJson } from '../_models/authAdminJson';
import { PayoutStatsJson } from '../_models/PayoutStatsJson';
import { PaymentTransactionRequestJSON } from '../_models/paymentTransactionRequestJson';
import { PayTransactionResponseJSON } from '../_models/payTransactionResponseJSON';
import { HackersRequestJson } from '../_models/hackersRequestJSON';
import { UpcomingPaymentResponseJSON } from '../_models/upcomingPaymentResponseJSON';
import { WalletBalanceJSON } from '../_models/walletsJSON';
import { VulnerabilitiesResponseJSON } from '../_models/vulnerabilitiesResponseJSON';
import { VulnerabilityStatsJSON } from '../_models/vulnerabilityStatsJson';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class AdminService {
  constructor(private httpClient: HttpClient) {}

  getProjects(): Observable<any> {
    let response = this.httpClient.get<
      HTTPResponseWrapper<ListCustomerProjectJson[]>
    >(`${environment.adminPortalApiUrl}/v1/Projects`);
    let payload = response.pipe(map((response) => response.result));
    return payload;
  }

  getProjectById(id: number): Observable<any> {
    let response = this.httpClient.get<
      HTTPResponseWrapper<ListCustomerProjectJson>
    >(`${environment.adminPortalApiUrl}/v1/Projects/${id}`);
    let payload = response.pipe(map((response) => response.result));
    return payload;
  }

  addReviewByAdmin(review: AddReviewJson): Observable<any> {
    let response = this.httpClient.post<HTTPResultWrapper>(
      `${environment.adminPortalApiUrl}/v1/Projects/reviews`,
      review
    );
    return response;
  }
  markProjectAsActive(projectId: number): Observable<any> {
    let response = this.httpClient.put<HTTPResultWrapper>(
      `${environment.adminPortalApiUrl}/v1/Projects/mark-active/${projectId}`,
      projectId
    );
    return response;
  }

  reviewProjectBugSubmissions(projectId: number): Observable<any> {
    let response = this.httpClient.get<
      HTTPResponseWrapper<BugReviewJsonList[]>
    >(`${environment.adminPortalApiUrl}/v1/Bugs/Projects/${projectId}`);
    // let payload = response.pipe(map(response => response.result));
    return response;
  }

  validateBugFromAdmin(bugReportId: number): Observable<any> {
    let response = this.httpClient.put<HTTPResultWrapper>(
      `${environment.adminPortalApiUrl}/v1/Bugs/validate/${bugReportId}`,
      bugReportId
    );
    return response;
  }

  BountyBySeverity(): Observable<any> {
    let response = this.httpClient.get<HTTPResponseWrapper<PayoutStatsJson>>(
      `${environment.adminPortalApiUrl}/v1/Bugs/payments/stats`
    );
    // let payload = response.pipe(map(response => response.result));
    return response;
  }

  getSpecificBugFromAdmin(id: number): Observable<any> {
    let response = this.httpClient.get<HTTPResponseWrapper<BugReviewJsonList>>(
      `${environment.adminPortalApiUrl}/v1/Bugs/${id}`
    );
    // let payload = response.pipe(map(response => response.result));
    return response;
  }

  getVulnerabilityPayoutStats(): Observable<any> {
    let response = this.httpClient.get<
      HTTPResponseWrapper<VulnerabilityStatsJSON[]>
    >(
      `${environment.adminPortalApiUrl}/v1/Bugs/vulneralbilities/payouts/stats`
    );
    // let payload = response.pipe(map(response => response.result));
    return response;
  }

  getBugDetail(bugId: number): Observable<any> {
    let response = this.httpClient.get<HTTPResponseWrapper<BugReviewJsonList>>(
      `${environment.adminPortalApiUrl}/v1/Bugs/${bugId}`
    );
    let payload = response.pipe(map((response) => response.result));
    return payload;
  }

  addBugReviewByAdmin(addbug: AddBugReviewJSON): Observable<any> {
    let response = this.httpClient.post<HTTPResultWrapper>(
      `${environment.adminPortalApiUrl}/v1/Bugs/reviews`,
      addbug
    );
    return response;
  }

  getAuthAdmin(): Observable<any> {
    let response = this.httpClient.get<
      HTTPResponseWrapper<AuthenticatedAdminJson>
    >(`${environment.adminPortalApiUrl}/v1/Admins/Me`);
    let payload = response.pipe(map((response) => response.result));

    return payload;
  }

  updateAuthAdmin(value: AuthenticatedAdminJson): Observable<any> {
    let response = this.httpClient.put<HTTPResultWrapper>(
      `${environment.adminPortalApiUrl}/v1/admins`,
      value
    );
    return response;
  }

  changePassword(body:any):Observable<any>{
    let response = this.httpClient.post<HTTPResponseWrapper<any>>(`${environment.hackerPortalApiUrl}/v1/Admins/Password/Change`, body);
    return response;
  }

  getPayoutStats(): Observable<any> {
    let response = this.httpClient.get<HTTPResponseWrapper<PayoutStatsJson>>(
      `${environment.adminPortalApiUrl}/v1/Bugs/payments/stats`
    );
    return response;
  }

  getVulnerabilityStats(): Observable<any> {
    let response = this.httpClient.get<HTTPResponseWrapper<PayoutStatsJson>>(
      `${environment.adminPortalApiUrl}/v1/Bugs/vulneralbilities/stats`
    );
    return response;
  }

  uploadAvatar(image: File): Observable<any> {
    const formData = new FormData();

    formData.append('file', image, image.name);
    let response = this.httpClient.put<HTTPResponseWrapper<Customer>>(
      `${environment.adminPortalApiUrl}/v1/admins/avatar/update`,
      formData
    );
    return response;
  }

  getAllCustomers(): Observable<any> {
    let response = this.httpClient.get<HTTPResponseWrapper<PayoutStatsJson>>(
      `${environment.adminPortalApiUrl}/v1/Bugs/vulneralbilities/stats`
    );
    return response;
  }

  getAllBugsByAdmin(): Observable<any> {
    let response = this.httpClient.get<
      HTTPResponseWrapper<BugReviewJsonList[]>
    >(`${environment.adminPortalApiUrl}/v1/Bugs`);
    return response;
  }

  getUpcomingPaymentsByAdmin(): Observable<any> {
    let response = this.httpClient.get<
      HTTPResponseWrapper<UpcomingPaymentResponseJSON[]>
    >(`${environment.adminPortalApiUrl}/v1/Payments/Upcoming`);
    return response;
  }

  getTestTypes(): Observable<any> {
    let response = this.httpClient.get<
      HTTPResponseWrapper<VulnerabilitiesResponseJSON[]>
    >(`${environment.adminPortalApiUrl}/v1/Projects/TestTypes`);
    let payload = response.pipe(map((response) => response.result));

    return payload;
  }

  getRequirementLevels(): Observable<any> {
    let response = this.httpClient.get<
      HTTPResponseWrapper<VulnerabilitiesResponseJSON[]>
    >(`${environment.adminPortalApiUrl}/v1/Projects/RequirementLevels`);
    let payload = response.pipe(map((response) => response.result));

    return payload;
  }

  getVulnerabilitiesFromAdmin(): Observable<any> {
    let response = this.httpClient.get<
      HTTPResponseWrapper<VulnerabilitiesResponseJSON[]>
    >(`${environment.adminPortalApiUrl}/v1/Projects/Vulnerabilities`);
    return response;
  }
  
  
  addVulnerabilitiesFromAdmin(vulnerability: any): Observable<any> {
    let response = this.httpClient.post<
    HTTPResponseWrapper<VulnerabilitiesResponseJSON>
    >(
      `${environment.adminPortalApiUrl}/v1/Projects/Vulnerabilities`,
      vulnerability
      );
      return response;
  }

  updateVulnerabilitiesFromAdmin(vulnerability: {
    id: number;
    type: string;
  }): Observable<any> {
    let response = this.httpClient.put<
      HTTPResponseWrapper<VulnerabilitiesResponseJSON>
    >(
      `${environment.adminPortalApiUrl}/v1/Projects/Vulnerabilities`,
      vulnerability
    );
    return response;
  }

  getVulnerabilityFromAdmin(id: number): Observable<any> {
    let response = this.httpClient.get<
      HTTPResponseWrapper<VulnerabilitiesResponseJSON>
    >(`${environment.adminPortalApiUrl}/v1/Projects/Vulnerabilities/${id}`);
    return response;
  }

  deleteVulnerability(id: number): Observable<any> {
    let response = this.httpClient.delete<HTTPResultWrapper>(
      `${environment.adminPortalApiUrl}/v1/Projects/Vulnerabilities/${id}`
    );
    return response;
  }


  getVulnerabilityTypes(): Observable<any> {
    let response = this.httpClient.get<
      HTTPResponseWrapper<any>
    >(`${environment.adminPortalApiUrl}/v1/Projects/VulnerabilitTypes`);
    let payload = response.pipe(map((response) => response.result));

    return payload;
  }

  getVulnerabilityType(id: number): Observable<any> {
    let response = this.httpClient.get<
      HTTPResponseWrapper<any>
    >(`${environment.adminPortalApiUrl}/v1/Projects/VulnerabilitTypes/${id}`);
    return response;
  }
    
  addVulnerabilityTypes(body: any): Observable<any> {
    let response = this.httpClient.post<
      HTTPResponseWrapper<any>
    >(`${environment.adminPortalApiUrl}/v1/Projects/VulnerabilitTypes`, body);
    return response;
  }

  updateVulnerabilityTypes(vulnerabilityType: any): Observable<any> {
    let response = this.httpClient.put<
      HTTPResponseWrapper<any>
    >(
      `${environment.adminPortalApiUrl}/v1/Projects/VulnerabilityTypes`,
      vulnerabilityType
    );
    return response;
  }

  deleteVulnerabilityType(id: number): Observable<any> {
    let response = this.httpClient.delete<HTTPResultWrapper>(
      `${environment.adminPortalApiUrl}/v1/Projects/VulnerabilitTypes/${id}`
    );
    return response;
  }


  transferFundsToHacker(req: PaymentTransactionRequestJSON): Observable<any> {
    let response = this.httpClient.post<
      HTTPResponseWrapper<PayTransactionResponseJSON>
    >(
      `${environment.adminPortalApiUrl}/v1/Payments/Transactions/Transfer`,
      req
    );
    return response;
  }

  getTransactions(): Observable<any> {
    let response = this.httpClient.get<
      HTTPResponseWrapper<PayTransactionResponseJSON>
    >(`${environment.adminPortalApiUrl}/v1/Payments/Transactions`);
    let payload = response.pipe(map((response) => response.result));

    return payload;
  }

  getTransactionsMetrics(): Observable<any> {
    let response = this.httpClient.post<HTTPResponseWrapper<any>>(
      `${environment.adminPortalApiUrl}/v1/Payments/Transactions/Metrics`,
      null
    );
    let payload = response.pipe(map((response) => response.result));

    return payload;
  }

  getAllHackersFromAdmin(): Observable<any> {
    let response = this.httpClient.get<
      HTTPResponseWrapper<HackersRequestJson[]>
    >(`${environment.adminPortalApiUrl}/v1/Hackers`);
    return response;
  }

  getWalletBalance(): Observable<any> {
    let response = this.httpClient.get<HTTPResponseWrapper<WalletBalanceJSON>>(
      `${environment.adminPortalApiUrl}/v1/Payments/Wallet`
    );
    return response;
  }
  
  getCharges(): Observable<any> {
    let response = this.httpClient.get<HTTPResponseWrapper<WalletBalanceJSON>>(
      `${environment.adminPortalApiUrl}/v1/Charges`
    );
    return response;
  }

  getPastCustomerPayouts(): Observable<any> {
    let response = this.httpClient.get<
      HTTPResponseWrapper<UpcomingPaymentResponseJSON[]>
    >(`${environment.adminPortalApiUrl}/v1/Payments/Past`);
    return response;
  }

  getCustomersFromAdmin(): Observable<any> {
    let response = this.httpClient.get<HTTPResponseWrapper<Customer[]>>(
      `${environment.adminPortalApiUrl}/v1/Customers`
    );
    return response;
  }

  getCustomerFromAdmin(userid: number): Observable<any> {
    let response = this.httpClient.get<HTTPResponseWrapper<Customer>>(
      `${environment.adminPortalApiUrl}/v1/Customers/${userid}`
    );
    return response;
  }

  blockUserFromAdmin(value: {
    userId: string;
    reason: string;
  }): Observable<any> {
    let response = this.httpClient.put<HTTPResponseWrapper<Customer>>(
      `${environment.adminPortalApiUrl}/v1/Customers/block`,
      value
    );
    return response;
  }

  blockHackerFromAdmin(value: {
    userId: string;
    reason: string;
  }): Observable<any> {
    let response = this.httpClient.put<HTTPResponseWrapper<Hacker>>(
      `${environment.adminPortalApiUrl}/v1/Hackers/block`,
      value
    );
    return response;
  }

  unblockHackersFromAdmin(value: {
    userId: string;
    reason: string;
  }): Observable<any> {
    let response = this.httpClient.put<HTTPResponseWrapper<Hacker>>(
      `${environment.adminPortalApiUrl}/v1/Hackers/unblock`,
      value
    );
    return response;
  }

  getHackerByUserId(userId: string) {
    let response = this.httpClient.get<HTTPResponseWrapper<Hacker>>(
      `${environment.adminPortalApiUrl}/v1/Hackers/get-by-userId/${userId}`
    );
    return response;
  }

  unblockUserFromAdmin(value: {
    userId: string;
    reason: string;
  }): Observable<any> {
    let response = this.httpClient.put<HTTPResponseWrapper<Customer>>(
      `${environment.adminPortalApiUrl}/v1/Customers/unblock`,
      value
    );
    return response;
  }

  getBugs(): Observable<any> {
    let response = this.httpClient.get<HTTPResponseWrapper<any>>(
      `${environment.adminPortalApiUrl}/v1/Bugs`
    );
    let payload = response.pipe(map((response) => response.result));

    return payload;
  }
}
