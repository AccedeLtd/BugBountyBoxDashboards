import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, pipe } from 'rxjs';
import { map, mergeMap, shareReplay, switchMap } from 'rxjs/operators';
import { HTTPResponseWrapper } from '../_models';
import { CreateBugReportInput } from '../_models/createBugReportInput';
import { notificationHubJson } from '../_models/notificationHubJson';
import countries from '../_utils/countries';
import { BankDto } from '../_utils/payout-account.dto';

@Injectable({
  providedIn: 'root'  
})
export class HackerService {
  private user$!: Observable<any>;
  private banks$!: Observable<BankDto[]>;
  
  constructor(
    private http: HttpClient,
  ) {
    this.refreshUser();
    this.refreshBanks();
  }

  private refreshUser() {
    this.user$ = this.http
      .get<HTTPResponseWrapper<any>>(`${environment.hackerPortalApiUrl}/v1/Hackers/Me`)
      .pipe(
        map(response => response.result),
        shareReplay(1)
      );
  }
  
  private refreshBanks() {
    this.banks$ = this.user$.pipe(
      switchMap((user) => {
        const country = countries.find(
          (c) => c.name.toLowerCase() == user.country.toLowerCase()
        );

        return this.http.get<HTTPResponseWrapper<any>>(
          `${environment.hackerPortalApiUrl}/v1/Wallets/PaymentMethods/Banks`,
          {
            params: {
              countryCode: country?.code ?? 'GH',
            },
          }
        );
      }),
      map((response) => {
        const banks = response.result.data;
        banks.forEach((b: any) => (b.name = b.name?.trim()));
        return banks.sort((a: any, b: any) => a.name.localeCompare(b.name));
      }),
      shareReplay(1)
    );
  }

  getProfile(): Observable<any> {
    return this.user$;
  }
  
  getBanks(): Observable<any> {
    return this.banks$;
  }
  
  getUser(): Observable<any>{
    let response = this.http.get<HTTPResponseWrapper<any>>(`${environment.hackerPortalApiUrl}/v1/Hackers/Me`);
    let payload = response.pipe(map(response => response.result)); 

    return payload;
  }
  
  getHacker(): Observable<any>{
    // let response = this.http.get<HTTPResponseWrapper<any>>(`${environment.apiUrl}/v1/Users/Hacker/Me`);
    let response = this.http.get<HTTPResponseWrapper<any>>(`${environment.hackerPortalApiUrl}/v1/Hackers/Me`);
    let payload = response.pipe(map(response => response.result));

    return payload;
  }

  getHackersNotifications():Observable<any>{
    let response = this.http.get<HTTPResponseWrapper<any>>(`${environment.hackerPortalApiUrl}/v1/notifications`);
    let payload = response.pipe(map(response => response.result));  

    return payload;
  }
  
  getHackerById(id: any): Observable<any>{
    let response = this.http.get<HTTPResponseWrapper<any>>(`${environment.hackerPortalApiUrl}/v1/Hackers/${id}`);
    let payload = response.pipe(map(response => response.result));

    return payload;
  }
  
  getHackerByUserId(id: any): Observable<any>{
    let response = this.http.get<HTTPResponseWrapper<any>>(`${environment.hackerPortalApiUrl}/v1/Hackers/get-by-userId/${id}`);
    let payload = response.pipe(map(response => response.result));

    return payload;
  }
  
  getHackers(): Observable<any>{
    // let response = this.http.get<HTTPResponseWrapper<any>>(`${environment.apiUrl}/v1/Users/Hacker/Me`);
    let response = this.http.get<HTTPResponseWrapper<any>>(`${environment.hackerPortalApiUrl}/v1/Hackers`);
    let payload = response.pipe(map(response => response.result));

    return payload;
  }

  updateHacker(body:any):Observable<any>{
    let response = this.http.put<HTTPResponseWrapper<any>>(`${environment.hackerPortalApiUrl}/v1/Hackers`, body).pipe(
      mergeMap(() => {
        this.refreshUser();
        this.refreshBanks();
        return this.user$;
      })
    );
    return response;
  }
  
  changePassword(body:any):Observable<any>{
    let response = this.http.post<HTTPResponseWrapper<any>>(`${environment.hackerPortalApiUrl}/v1/Hackers/Password/Change`, body);
    return response;
  }

  uploadAvatar(image:File):Observable<any>{
    const formData = new FormData();
    formData.append('file', image, image.name);

    let response = this.http.put<HTTPResponseWrapper<any>>(`${environment.hackerPortalApiUrl}/v1/Hackers/Avatar/Update`, formData);
    return response;
  }
  
  getBountyStats(): Observable<any>{
    let response = this.http.get<HTTPResponseWrapper<any>>(`${environment.hackerPortalApiUrl}/v1/Bugs/bounty/stats`);
    let payload = response.pipe(map(response => response.result));

    return payload;
  }
  
  getTasks(): Observable<any>{
    let response = this.http.get<HTTPResponseWrapper<any>>(`${environment.hackerPortalApiUrl}/v1/Tasks`);
    let payload = response.pipe(map(response => response.result));

    return payload;
  }
  
  getBountyOverview(): Observable<any>{
    let response = this.http.get<HTTPResponseWrapper<any>>(`${environment.hackerPortalApiUrl}/v1/Bugs/bounty-overview`);
    let payload = response.pipe(map(response => response.result));

    return payload;
  }
  
  getBountyActivity(): Observable<any>{
    let response = this.http.get<HTTPResponseWrapper<any>>(`${environment.hackerPortalApiUrl}/v1/Bugs/bounty-activity`);
    let payload = response.pipe(map(response => response.result));

    return payload;
  }
  
  getHackerBountyActivity(): Observable<any>{
    let response = this.http.get<HTTPResponseWrapper<any>>(`${environment.hackerPortalApiUrl}/v1/Bugs/bounty-activity/me`);
    let payload = response.pipe(map(response => response.result));

    return payload;
  }
  
  getBountyActivityByHackerId(hackerId: any): Observable<any>{
    let response = this.http.get<HTTPResponseWrapper<any>>(`${environment.hackerPortalApiUrl}/v1/Bugs/bounty-activity/${hackerId}`);
    let payload = response.pipe(map(response => response.result.data));

    return payload;
  }
  
  getRatingsByHackerId(hackerUserId: any): Observable<any>{
    let response = this.http.get<HTTPResponseWrapper<any>>(`${environment.hackerPortalApiUrl}/v1/Ratings/Hacker/${hackerUserId}`);
    let payload = response.pipe(map(response => response.result));

    return payload;
  }

  getTestingTypes(): Observable<any>{
    let response = this.http.get<HTTPResponseWrapper<any>>(`${environment.hackerPortalApiUrl}/v1/Projects/TestTypes`);
    let payload = response.pipe(map(response => response.result.data));

    return payload;
  }

  getRequirementLevels(): Observable<any>{
    let response = this.http.get<HTTPResponseWrapper<any>>(`${environment.hackerPortalApiUrl}/v1/Projects/RequirementLevels`);
    let payload = response.pipe(map(response => response.result.data));

    return payload;  
  }
  
  getProjects(input: any): Observable<any>{
    const params: any = {};
    if(input.requirementLevelId) params.RequirementLevelId = input.requirementLevelId;

    let response = this.http.get<HTTPResponseWrapper<any>>(`${environment.hackerPortalApiUrl}/v1/Projects`, {params});
    let payload = response.pipe(map(response => response.result));

    return payload;
  }

  getProject(id: number): Observable<any>{
    let response = this.http.get<HTTPResponseWrapper<any>>(`${environment.hackerPortalApiUrl}/v1/Projects/${id}`);
    let payload = response.pipe(map(response => response.result));
    return payload;
  }

  withdrawFromWallet(body: any): Observable<any>{
    let response = this.http.post<HTTPResponseWrapper<any>>(`${environment.hackerPortalApiUrl}/v1/Wallets/Payments/Cashout`, body);
    let payload = response.pipe(map(response => response.result));

    return payload;
  }
  
  getWalletBalance(): Observable<any>{
    let response = this.http.get<HTTPResponseWrapper<any>>(`${environment.hackerPortalApiUrl}/v1/Wallets`);
    let payload = response.pipe(map(response => response.result));

    return payload;
  }
  
  getUpcomingPayments(): Observable<any>{
    let response = this.http.get<HTTPResponseWrapper<any>>(`${environment.hackerPortalApiUrl}/v1/Wallets/Payments/Upcoming`);
    let payload = response.pipe(map(response => response.result));

    return payload;
  }
  
  getPastPayments(): Observable<any>{
    let response = this.http.get<HTTPResponseWrapper<any>>(`${environment.hackerPortalApiUrl}/v1/Wallets/Payments/Past`);
    let payload = response.pipe(map(response => response.result));

    return payload;
  }
  
  getTransactions(): Observable<any>{
    let response = this.http.get<HTTPResponseWrapper<any>>(`${environment.hackerPortalApiUrl}/v1/Wallets/Transactions`);
    let payload = response.pipe(map(response => response.result));

    return payload;
  }
  
  getTransactionsMetrics(): Observable<any> {
    let response = this.http.post<HTTPResponseWrapper<any>>(`${environment.hackerPortalApiUrl}/v1/Wallets/Transactions/Metrics`, null);
    let payload = response.pipe(
      map(response => response.result)
    );

    return payload;
  }
  
  getAssetTypes(): Observable<any>{
    let response = this.http.get<HTTPResponseWrapper<any>>(`${environment.hackerPortalApiUrl}/v1/Projects/assetTypes`);
    let payload = response.pipe(map(response => response.result));

    return payload;
  }

  getVulnerabilityTypes(): Observable<any>{
    let response = this.http.get<HTTPResponseWrapper<any>>(`${environment.hackerPortalApiUrl}/v1/Projects/VulnerabilitTypes`);
    let payload = response.pipe(map(response => response.result));

    return payload;
  }
  
  getVulnerabilities(): Observable<any>{
    let response = this.http.get<HTTPResponseWrapper<any>>(`${environment.hackerPortalApiUrl}/v1/Projects/vulenrabilities`);
    let payload = response.pipe(map(response => response.result));

    return payload;
  }

  createBugReport(body: CreateBugReportInput): Observable<HTTPResponseWrapper<any>>{
    let response = this.http.post<HTTPResponseWrapper<any>>(`${environment.hackerPortalApiUrl}/v1/Bugs`, body);
    let payload = response.pipe(map(response => response));

    return payload;
  }

  getBug(bugId: any): Observable<any>{
    let response = this.http.get<HTTPResponseWrapper<any>>(`${environment.hackerPortalApiUrl}/v1/Bugs/${bugId}`);
    let payload = response.pipe(map(response => response.result));

    return payload;
  }

  getPaymentMethods() {
    let response = this.http.get<HTTPResponseWrapper<any>>(`${environment.hackerPortalApiUrl}/v1/Wallets/PaymentMethods`);
    let payload = response.pipe(map(response => response.result));

    return payload;
  }
  
  addPaymentMethod(body: any) {
    let response = this.http.post<HTTPResponseWrapper<any>>(`${environment.hackerPortalApiUrl}/v1/Wallets/PaymentMethods`, body);
    let payload = response.pipe(map(response => response));
    
    return payload;
  }

  editPaymentMethod(body: any) {
    let response = this.http.put<HTTPResponseWrapper<any>>(`${environment.hackerPortalApiUrl}/v1/Wallets/PaymentMethods`, body);
    let payload = response.pipe(map(response => response));
    
    return payload;
  }
  
  removePaymentMethod(id: any) {
    let response = this.http.delete<HTTPResponseWrapper<any>>(`${environment.hackerPortalApiUrl}/v1/Wallets/PaymentMethods/${id}`);
    let payload = response.pipe(map(response => response.result));
    
    return payload;
  }
  
  getProficiencies() {
    let response = this.http.get<HTTPResponseWrapper<any>>(`${environment.hackerPortalApiUrl}/v1/Hackers/Proficiencies`);
    let payload = response.pipe(map(response => response.result));

    return payload;
  }
  
  updateProficiencies(body: any) {
    let response = this.http.put<HTTPResponseWrapper<any>>(`${environment.hackerPortalApiUrl}/v1/Hackers/Proficiencies`, body);
    let payload = response.pipe(map(response => response.result));

    return payload;
  }
  
  deleteAccount(body: any) {
    let response = this.http.post<HTTPResponseWrapper<any>>(`${environment.hackerPortalApiUrl}/v1/Hackers/Me/Delete`, body);
    let payload = response.pipe(map(response => response.result));

    return payload;
  }
  
  followHacker(userId: any) {
    let response = this.http.put<HTTPResponseWrapper<any>>(`${environment.hackerPortalApiUrl}/v1/Hackers/Follow/${userId}`, null);
    let payload = response.pipe(map(response => response.result));

    return payload;
  }
  
  unfollowHacker(userId: any) {
    let response = this.http.put<HTTPResponseWrapper<any>>(`${environment.hackerPortalApiUrl}/v1/Hackers/Unfollow/${userId}`, null);
    let payload = response.pipe(map(response => response.result));

    return payload;
  }

  createTask(body: any): Observable<HTTPResponseWrapper<any>>{
    let response = this.http.post<HTTPResponseWrapper<any>>(`${environment.hackerPortalApiUrl}/v1/Tasks`, body);
    let payload = response.pipe(map(response => response.result));

    return payload;
  }
  
  updateTask(body: any): Observable<HTTPResponseWrapper<any>>{
    let response = this.http.put<HTTPResponseWrapper<any>>(`${environment.hackerPortalApiUrl}/v1/Tasks`, body);
    let payload = response.pipe(map(response => response.result));

    return payload;
  }
  
  deleteTask(id: any): Observable<HTTPResponseWrapper<any>>{
    let response = this.http.delete<HTTPResponseWrapper<any>>(`${environment.hackerPortalApiUrl}/v1/Tasks/${id}`);
    let payload = response.pipe(map(response => response.result));

    return payload;
  }
}
