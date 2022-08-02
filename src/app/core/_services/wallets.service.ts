import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { firstValueFrom, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HTTPResponseWrapper } from '../_models';

@Injectable({
  providedIn: 'root'
})
export class WalletsService {
  
  constructor(private http: HttpClient) { }
  
  getWalletBalance(): Observable<any>{
    let response = this.http.get<HTTPResponseWrapper<any>>(`${environment.customerPortalApiUrl}/v1/Wallets`);
    let payload = response.pipe(map(response => response.result));

    return payload;
  }
  
  topupWallet(body: any): Observable<any>{
    let response = this.http.post<HTTPResponseWrapper<any>>(`${environment.customerPortalApiUrl}/v1/Wallets/Transactions/TopUp`, body);
    let payload = response.pipe(map(response => response.result));

    return payload;
  }
  
  async createOrderOnServer(body: any): Promise<any>{
    let response = this.http.post<HTTPResponseWrapper<any>>(`${environment.customerPortalApiUrl}/v1/Wallets/Transactions/Orders`, body);
    let payload = response.pipe(map(response => response.result));

    let see =  await firstValueFrom(payload);
    return  see;
  }

  async authorizeOnServer(body: any): Promise<any>{
    let response = this.http.post<HTTPResponseWrapper<any>>(`${environment.customerPortalApiUrl}/v1/Wallets/Transactions/Orders/Capture`, body);
    let payload = response.pipe(map(response => response.result));

    let seer =  await firstValueFrom(payload);
    return  seer;
  }
}
