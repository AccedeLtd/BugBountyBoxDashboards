import { Injectable } from '@angular/core';
import * as signalR from "@microsoft/signalr";
import { environment } from 'src/environments/environment';
// import { NotificationNames } from '../_enums/notificationNames';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { constants } from '../_utils/const';
import {notificationHubJson} from '../_models/notificationHubJson';
import { NotificationService } from './notification.service';
import { HackerService } from './hacker.service';

@Injectable({providedIn: 'root'})
export class NotificationHubService {
    private hubConnection?: signalR.HubConnection;
    allHackersNotifications:notificationHubJson[] = [];  
    result:notificationHubJson = {
      id:'',
        createdBy:'',
        createdAt:new Date,
        modifiedBy:'',
        modifiedAt:new Date,
        message:'',
        title:'',
        subject:'',
        notificationName:'',
        userId:'',
        userEmail:'',
        emailTemplate:'',
        htmlFormattedMessage:'',
        linkText:'',
        linkUrl:'',
        firebaseToken:'',
        status:0
    };

    constructor(
      private oidcSecurity:OidcSecurityService,
      private notification:NotificationService,
      private hackerService:HackerService){  

    }
    

    public startConnection = () => {
      let accessToken = this.oidcSecurity.getAccessToken('hacker');
        this.hubConnection = new signalR.HubConnectionBuilder()
        .withUrl(`${environment.notificationHub}`, { 
          accessTokenFactory: () =>  accessToken
        })
        .configureLogging(signalR.LogLevel.Information)
        .build();
        this.hubConnection
        .start() 
        .then(
          // () => console.log('Connection started')
          )
        .catch(
          // err => console.log('Error while starting connection: ' + err)
          );   
          this.fundsReceivedNotification();
    }  
       
    

    public createProjectListener = () => {
        this.hubConnection?.on("", (data:notificationHubJson) => {
          // console.log(data);
          this.result = data;
          
        });
      }


    public fundsReceivedNotification = () => {  
      this.hubConnection?.on("FundsReceivedNotification", (data:notificationHubJson) => {
        // console.log(data);
        this.result = data;
        this.allHackersNotifications.push(this.result);
        this.allHackersNotifications.sort((a,b) => Date.parse(`${b.createdAt}`) - Date.parse(`${a.createdAt}`));
        this.notification.showSuccess("Funds have been received successfully","Congratulations");
      });
    }
   
    
}