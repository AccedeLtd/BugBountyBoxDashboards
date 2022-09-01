import { Component, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { HackerService } from 'src/app/core/_services/hacker.service';
import { Observable } from 'rxjs';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexLegend, ApexPlotOptions, ApexTitleSubtitle, ApexXAxis } from 'ng-apexcharts';
import { WalletsService } from 'src/app/core/_services/wallets.service';
import { CustomerService } from 'src/app/core/_services/customer.service';
import { RequirementLevel } from 'src/app/core/_models/listCustomerProjectJson';
import { ProjectStatus } from 'src/app/core/_enums/projectStatus';
import * as _ from 'lodash';
import { MatDialog } from '@angular/material/dialog';
import { AddFundsDialogComponent } from '../settings/add-funds-dialog/add-funds-dialog.component';
import { DialogActions } from 'src/app/core/_enums/dialoagActions';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
  legend: ApexLegend;
  plotOptions:ApexPlotOptions;
  dataLabels:ApexDataLabels;
};

export type PayoutOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
  legend: ApexLegend;
  plotOptions:ApexPlotOptions;
  dataLabels:ApexDataLabels;
};

export type ProjectDomain = {
    id: number,
    name:	string
}

export type ProjectDomains = {
    id: number,
    name:	string
}

export type Customer = {
  id:	number,
  email:	string,
  fullName:	string,
  userName:	string,
  country:	string,
  businessName:	string,
  userId:	string,
  logoUrl:	string,
  phoneNumber:	string,
  walletId:	number,
}

export type TestType = {
  id:	number,
  name:	string
}

export type ProjectReview = {
  comment:	string,
  date:	string,
  userName:	string
}

export type Project = {
  id: number,
  title: string,
  description: string
  bounty: number,
  postedAt: string,
  closedAt: string,
  projectStatus: number,
  domains: ProjectDomain[],
  customer: Customer,
  requirementLevel: RequirementLevel,
  testType: TestType,
  reviews: ProjectReview[]
}
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  sideNavOpened = false;
  loading: boolean = true;
  loadingWalletBalance: boolean = true;
  loadingProjects: boolean = true;
  loadingBounties: boolean = true;
  loadingPayments: boolean = true;
  loadingPayouts: boolean = true;  
  user: any;
  authUser: any;
  userName: any;
  
  public chartOptions: Partial<ChartOptions> | any;  
  public payoutOptions: Partial<PayoutOptions> | any;
  
  walletkey = '3Bwallet';
  walletBalance: string = '0.00';
  walletBalance$ : Observable<any> | undefined;
  userData: any;
  projectStats: any;
  bountyStats: any;
  bountyMapping: {[k: string]: string} = { 
    '=0': 'Bounties',
    '=1': 'Bounty',
    'other': 'Bounties'
  };
  paymentStats: any;
  payouts: any;
  payoutsCount: any;

  constructor(
    @Inject(DOCUMENT) public document: Document,
    public oidcSecurityService: OidcSecurityService,
    public hackerService: HackerService,
    public walletsService: WalletsService,
    public customerService: CustomerService,
    public dialog: MatDialog,
  ) {
    this.chartOptions = { 
      series: [0, 0, 0, 0],
      // series: [26, 34, 20, 15],
      colors:['#35A8E0', '#FC007E', '#93C01F', '#F29100'],
      labels: ['Active Projects', 'Closed Projects', 'Eligible for Bounty', 'Not Eligible for Bounty'],
      chart: {  
          height: 200,
          type: "donut",
          animations: {
            enabled: true,
            easing: 'easeinout',
            speed: 800,
            animateGradually: {
                enabled: true,
                delay: 150
            },
            dynamicAnimation: {
                enabled: true,
                speed: 350
            }
        }
        },
        legend:{
          show:false
        },
        plotOptions: {
          pie: {
            size: 250,
            donut: {
              labels: {
                show: true,
                name: {
                  show: true,
                  fontSize: '22px',
                  fontWeight: 600,
                  color: undefined,
                  offsetY: 16
                },
                value: {
                  show: true,
                  fontSize: '16px',
                  fontWeight: 400,
                  color: undefined,
                  offsetY: -16 
                },
                total:{
                  show: true,
                  showAlways: true,
                  label: 'Total Projects',
                  fontSize: '12px',
                  fontWeight: 400,
                  color: '#373d3f', 
                  formatter: (w:any) => {
                    return w.globals.seriesTotals.reduce((a:any, b:any) => {
                      return a + b
                    }, 0)}
                }
              }
            }
          }
        },
        dataLabels: {
          enabled: false
          },
    };
    this.payoutOptions = { 
      series: [30000, 30000, 30000, 30000],
      labels: ['Medium','Low','High','Critical'],
      chart: {  
          height: 250,
          type: "donut",
          animations: {
            enabled: true,
            easing: 'easeinout',
            speed: 800,
            animateGradually: {
                enabled: true,
                delay: 150
            },
            dynamicAnimation: {
                enabled: true,
                speed: 350
            }
          }
        },
        legend:{
          show:false
        },
        plotOptions: {
          pie: {
            size: 250,
            donut: {
              labels: {
                show: true,
                name: {
                  show: true,
                  fontSize: '22px',
                  fontWeight: 600,
                  color: undefined,
                  offsetY: 16
                },
                value: {
                  show: true,
                  fontSize: '16px',
                  fontWeight: 400,
                  color: undefined,
                  offsetY: -16 
                },
                total:{
                  show: true,
                  showAlways: false,
                  label: 'Total Payouts',
                  fontSize: '12px',
                  fontWeight: 400,
                  color: '#373d3f', 
                  formatter: (w:any) => {
                    return "KES" + " " + w.globals.seriesTotals.reduce((a:any, b:any) => {
                      return a + b
                    }, 0)}
                }
              }
            }
          }
        },
        dataLabels: {
          enabled: false
          },
    };
  }

  async ngOnInit(): Promise<void> {
    this.userData = this.oidcSecurityService.getUserData();
    this.loadProjectStats();
    this.loadBounties();
    this.loadWalletBalance();
    this.loadPaymentStats();
    this.loadPayouts();
	}

  loadProjectStats() {
    this.customerService.getProjectStats().subscribe(
      result => {
        this.projectStats = result;
        const projectStatsSeries = Object.values(result)
        this.chartOptions.series = projectStatsSeries;
        this.loadingProjects = false;
      }
    )
  }
  
  loadPaymentStats() {
    this.customerService.getPaymentStats().subscribe(
      result => {
        const total = Object.values(result).reduce((a: any, b: any) => a + b, 0);
        this.paymentStats = result;
        this.paymentStats.total = total;
    //    console.log(this.paymentStats);
        this.loadingPayments = false;
      }
    )
  }
  
  loadBounties() {
    const query = {
      projectStatus: ProjectStatus.Active,
      testTypeId: undefined,
      page: undefined,
      pageSize: undefined,
      skipCount: undefined,
    }

    this.customerService.getCustomerProjectsWithQuery(query).subscribe(
      result => {
        const see = _.groupBy(result.data, data => data.testType.id);
        const seer = Object.values(see);    
    //    console.log(seer);

        this.bountyStats = {
          totalCount: result.totalCount,
          web: {
            webCount: seer[0]?.length || 0,
            percentile: this.getPercentile(seer[0]?.length, result.totalCount) || 0
          },
          mobile: {
            mobileCount: seer[1]?.length || 0,
            percentile: this.getPercentile(seer[1]?.length, result.totalCount) || 0
          }
        }  

    //    console.log(this.bountyStats);

        this.loadingBounties = false;
      }
    )
  }

  getPercentile(partialValue: any, totalValue: any) {
    return (100 * partialValue) / totalValue;
  }
  
  loadPayouts() {
    this.customerService.getPayouts().subscribe(
			result => {
        this.payoutsCount = result.totalCount;
        this.payouts = (result.data as any[])?.slice(0, 3);
        this.loadingPayouts = false;
			}
		)
  }

  loadWalletBalance() {
    this.loadingWalletBalance = true;
    //TODO: use RxJS
    this.walletsService.getWalletBalance().subscribe(
			result => {
        this.walletBalance = result.balance;
        this.loadingWalletBalance = false;
			}
		)
    
  }

  addFunds() {
    const dialogRef = this.dialog.open(AddFundsDialogComponent, {
      height: '700px',
      width: '600px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result.event == DialogActions.Update){
        this.loadWalletBalance();
      }
    });
  }

  getUser() {    
    this.hackerService.getHacker().subscribe(
			result => {
        this.user = result;

        if(result)
				  this.userName = result.userName;
        else
				  this.userName = this.authUser.userName;

        this.loading = false;
			}
		)
  }

  toggleSideNav() {
    this.sideNavOpened = !this.sideNavOpened;
  }

  logout() {
    this.oidcSecurityService.logoff();
  }
}
