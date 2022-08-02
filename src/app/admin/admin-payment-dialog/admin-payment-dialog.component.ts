import {Component, Inject,OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { PaymentTransactionRequestJSON } from 'src/app/core/_models/paymentTransactionRequestJson';
import { PayTransactionResponseJSON } from 'src/app/core/_models/payTransactionResponseJSON';
import { UpcomingPaymentsJSON } from 'src/app/core/_models/upcomingPaymentsJSON';
import { WalletBalanceJSON } from 'src/app/core/_models/walletsJSON';
import { AdminService } from 'src/app/core/_services/admin.services';
import { NotificationService } from 'src/app/core/_services/notification.service';

@Component({
  selector: 'app-admin-payment-dialog',
  templateUrl: './admin-payment-dialog.component.html',
  styleUrls: ['./admin-payment-dialog.component.css']
})
export class AdminPaymentDialogComponent implements OnInit {

  payLoading:boolean = false;
  areYouSureLoading:boolean = false;
  paymentProcessing:boolean = false;
  upcomingPayments:UpcomingPaymentsJSON[] = [];
  paymentResponse?:PayTransactionResponseJSON;
  balance:WalletBalanceJSON = {
    id:0,
    balance:0,
    userId:'',
    fullName:'',
    email:'',
    phoneNumber:'',
    walletType:0
  };
  dataTransaction:PaymentTransactionRequestJSON ={
    transactionId:'',
    amount:0,
    charge:0,
    project:{
      projectId:0,
      projectTitle:'',
      businessName:'',
      customerUserId:'',
      companyLogo:'',
      hackerUserId:'',
      hackerName:'',
      avatarUrl:''
    }
  }
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private adminService:AdminService,
    private notifyService:NotificationService,
    private dialogRef: MatDialogRef<AdminPaymentDialogComponent>) {
    
   }
   showToasterSuccess(message:string){
    this.notifyService.showSuccess(message, "Congratulations")
  }
 
showToasterError(message:string) {
    this.notifyService.showError(message, "Sorry")
  } 
  ngOnInit(): void {
    this.getUpcomingPaymentsByAdmin();
    this.getAdminWalletBalance();
//    console.log(`passed data: ${JSON.stringify(this.data)}`);  
  }

  prePayment(){
    this.areYouSureLoading = !this.areYouSureLoading;
  }

  actualPayment(){
    this.paymentProcessing = !this.paymentProcessing;
    this.dataTransaction = {
      transactionId:this.data.id,
      amount:this.data.amount,
      charge:this.data.charge,
      project:{
        projectId:this.data.project.projectId,
        projectTitle:this.data.project.projectTitle,
        businessName:this.data.project.businessName, 
        customerUserId:this.data.project.customerUserId,
        companyLogo:this.data.project.companyLogo,
        hackerUserId:this.data.project.hackerUserId,
        hackerName:this.data.project.hackerName,
        avatarUrl:this.data.project.avatarUrl
      }
    }
    this.adminService.transferFundsToHacker(this.dataTransaction).subscribe(
      results => {
    //    console.log(`${this.dataTransaction}`);
        this.paymentResponse = results.result;
    //    console.log(`payment response: ${JSON.stringify(this.paymentResponse)}`);
        if(this.balance.balance >= this.dataTransaction.amount) {
          this.showToasterSuccess("the payment has gone through successfully")
          this.dialogRef.close({ data: this.data.id })
        } 
        if(this.balance.balance < this.dataTransaction.amount) {
          this.showToasterError("the payment cannot be processed: Insuficient funds");
        } 
       
        this.paymentProcessing = !this.paymentProcessing;
      }
    )
  }

  getUpcomingPaymentsByAdmin(){
    this.adminService.getUpcomingPaymentsByAdmin().subscribe(
      results => {
    //    console.log(this.data.id);
    //    console.log(`${JSON.stringify(results)}`);  
        this.upcomingPayments = results.result.data;
    //    console.log(`upcoming payments: ${JSON.stringify(this.upcomingPayments)}`);
      }
    )
  }

  getAdminWalletBalance(){
    this.adminService.getWalletBalance().subscribe(
      results => {
        this.balance = results.result;
    //    console.log(this.balance);
      }
    )
  }
}
