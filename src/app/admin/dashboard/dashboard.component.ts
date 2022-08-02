import { Component, Inject, NgZone, ViewChild } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { DOCUMENT } from '@angular/common';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { HackerService } from 'src/app/core/_services/hacker.service';
import { merge, Observable, of } from 'rxjs';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle,
  ApexLegend,
  ApexPlotOptions,
  ApexDataLabels
} from "ng-apexcharts";
import { AdminService } from 'src/app/core/_services/admin.services';
import { PayoutStatsJson } from 'src/app/core/_models/PayoutStatsJson';
import { Customer } from 'src/app/core/_models/listCustomerProjectJson';

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

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  sideNavOpened = false;

  sections = [
    { id: '', title: 'Dashboard', active: false },
    { id: '/payments', child: '/payments/details', title: 'Payments', active: false },
    { id: '/bounties', title: 'Bounties', active: false },
    { id: '/clients', title: 'Clients', active: false },
    { id: '/vulnerabilities', title: 'Vulnerabilities', active: false },
    { id: '/bugs', child: '/bugs/details', title: 'Bugs', active: false },
    { id: '/projects', child: '/projects/details', title: 'Projects', active: false },
    { id: '/hackers', child: '/bounty-activity/details', title: 'Hackers', active: false },
  ];
  
  user: any;
  authUser: any;
  userName: any;
  loading: boolean = true;

  //@ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions> | any;  
  public payoutOptions: Partial<PayoutOptions> | any;
  high?:number;
  activeClients:number = 0;
  notActiveClients:number = 0;
  totalClients:number = 0;
  allClients:Customer[] = [];
  public payouts:PayoutStatsJson = {
    high:0,
    medium:0,
    low:0,
    critical:0
  };
  public vulnerabilities:PayoutStatsJson = {
    high:0,
    medium:0,
    low:0,
    critical:0
  };

  

  totalPayouts:number = this.payouts.medium + this.payouts.critical + this.payouts.medium + this.payouts.high;
  constructor(
    @Inject(DOCUMENT) public document: Document,
    public oidcSecurityService: OidcSecurityService,
    public hackerService: HackerService,
    private adminService:AdminService
    
  ) {
    this.chartOptions = { 
      series: [this.vulnerabilities.medium, this.vulnerabilities.low, this.vulnerabilities.high, this.vulnerabilities.critical],  
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
                  label: 'Total Vulnerabilities',
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
      series: [this.payouts.medium, this.payouts.low, this.payouts.high, this.payouts.critical],
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
    this.loading = true;
    this.getPayoutStats();
    this.getVulnerabilityStats();
    this.totalPayouts;
    this.getAllCustomers();
	}

  getPayoutStats(){
    this.adminService.getPayoutStats().subscribe(
      results => {
        this.payouts = results.result;
        this.totalPayouts = this.payouts.medium + this.payouts.critical + this.payouts.high + this.payouts.low;
        this.payoutOptions.series = [this.payouts.medium,this.payouts.low,this.payouts.high,this.payouts.critical];
    //    console.log(this.chartOptions.series);
    //    console.log(`final: ${JSON.stringify(this.payouts)}`);   
      }
    )
  }

  getAllCustomers(){
    this.adminService.getCustomersFromAdmin().subscribe(results => {
      this.allClients = results.result.data;
      this.allClients.forEach(customer => {
        if(customer.isActive){
          this.activeClients += 1;
        }
        if(!customer.isActive){
          this.notActiveClients += 1;
        }
      });
      this.totalClients = this.activeClients + this.notActiveClients;
    })
  }

  getVulnerabilityStats(){
    this.adminService.getVulnerabilityStats().subscribe(
      results => {
        this.vulnerabilities = results.result;
        this.chartOptions.series = [this.vulnerabilities.medium,this.vulnerabilities.low,this.vulnerabilities.high,this.vulnerabilities.critical];
    //    console.log(`final: ${JSON.stringify(this.vulnerabilities)}`);   
      }
    )
  }

  toggleSideNav() {
    this.sideNavOpened = !this.sideNavOpened;
  }

  logout() {
    this.oidcSecurityService.logoff();
  }
  
  getAvatar() {
    return this.user ? this.user.image != null ? this.user.image : this.authUser.avatar != null ? this.authUser.avatar : `https://ui-avatars.com/api/?name=${this.userName}` : `https://ui-avatars.com/api/?name=${this.userName}`;
  }

  getCountry() {
    return this.user ? this.user.country != null ? this.user.country : this.authUser.countryOfResidence != null ? this.authUser.countryOfResidence : '-' : '-';
  }
}
