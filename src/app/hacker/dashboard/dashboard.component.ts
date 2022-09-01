import { Component, Inject, NgZone } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { DOCUMENT } from '@angular/common';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { HackerService } from 'src/app/core/_services/hacker.service';
import { forkJoin, merge, Observable, of } from 'rxjs';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexLegend, ApexPlotOptions, ApexTitleSubtitle, ApexXAxis } from 'ng-apexcharts';
import { MatDialog } from '@angular/material/dialog';
import { WithdrawDialogComponent } from '../settings/withdraw-dialog/withdraw-dialog.component';
import { DialogActions } from 'src/app/core/_enums/dialoagActions';
import LoadStatus from 'src/app/core/_utils/LoadStatus';
import * as _ from 'lodash';

export type ChartOptions = {
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
  user: any;
  authUser: any;
  userName: any;

  public chartOptions: Partial<ChartOptions> | any;
  bountyStats: any;
  loadingBountyStats: LoadStatus = 'loading';
  bountyOverview: any;
  loadingBountyOverview: LoadStatus = 'loading';
  taskOverview: any[] = [];
  loadingTaskOverview: LoadStatus = 'loading';
  bountyActivity: any[] = [];
  loadingBountyActivity: LoadStatus = 'loading';
  walletBalance: any;
  loadingWalletBalance: LoadStatus = 'loading';
  bountyProjects: any[] = [];
  taskStats: any;
  requirementLevelId: any;

  constructor(
    @Inject(DOCUMENT) public document: Document,
    public oidcSecurityService: OidcSecurityService,
    public hackerService: HackerService,
    public dialog: MatDialog,
  ) {
    this.chartOptions = { 
      colors:['#1F0FA3', '#FC097E'],
      series: [0,0],
      labels: ['Awaiting Payment','Closed Bounties'],
      chart: {  
          height: 100,
          width: 100,
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
            size: 50,
            donut: {
              labels: {
                show: true,
                name: {
                  show: false,
                  fontSize: '10px',
                  fontWeight: 600,
                  color: undefined,
                  offsetY: 16
                },
                value: {
                  show: false,
                  fontSize: '10px',
                  fontWeight: 400,
                  color: undefined,
                  offsetY: -16 
                },
                // total:{
                //   show: true,
                //   showAlways: false,
                //   label: 'Total Vulnerabilities',
                //   fontSize: '12px',
                //   fontWeight: 400,
                //   color: '#373d3f', 
                //   formatter: (w:any) => {
                //     return "KES" + " " + w.globals.seriesTotals.reduce((a:any, b:any) => {
                //       return a + b
                //     }, 0)}
                // }
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
		this.loadProfile();
		this.loadTaskOverview();
    this.loadWalletBalance();
		this.loadBountyActivity();
	}
  
  loadProfile() {
    forkJoin({
      userProfile: this.hackerService.getProfile(),
      testingTypes: this.hackerService.getTestingTypes(),
      requirementLevels: this.hackerService.getRequirementLevels(),
    }).subscribe({
      next: ({userProfile, testingTypes, requirementLevels}) => {
        const level = requirementLevels?.find((i: any) => i.name.includes(userProfile.level));
        this.requirementLevelId = level!.id;
        this.loadBountyOverview();
        // this.loadStatus = 'success';
      },
      error: () => {
        this.loadingBountyOverview = 'error';
      }
    })
  }

  loadBountyOverview() {
    this.loadingBountyOverview = 'loading';

    this.hackerService.getBountyOverview().subscribe({
			next:result => {
        const series = Object.values(result);
        const total = series.reduce((a:any, b:any) => a + b, 0);
        this.bountyOverview = result;
        this.bountyOverview.total = total;
        this.chartOptions.series = series;
        this.loadProjects();//hide loader in loadProjects()
			},
      error: err => {
        this.loadingBountyOverview = 'error';
      }
    })
  }

  loadProjects() {
    this.hackerService.getProjects({
      requirementLevelId: this.requirementLevelId
    }).subscribe({
			next: result => {
        this.bountyProjects = result.data;
        this.loadingBountyOverview = 'success';
			},
      error: err => {
        this.loadingBountyOverview = 'error';
      }
    })
  }
  
  loadTaskOverview() {
    this.loadingTaskOverview = 'loading';

    this.hackerService.getTasks().subscribe({
      next: result => {
        this.taskOverview = result.data;
        const groupedTasks = _.groupBy(result.data, data => data.isCompleted);
        const completedTasks = groupedTasks['true'] || [];
        const pendingTasks = groupedTasks['false'] || [];
        const dueTasks = pendingTasks.filter(d => this.isDue(d.dueDate));
        const upcomingTasks = pendingTasks.filter(d => this.isUpcoming(d.dueDate));

        this.taskStats = {
          dueCount: dueTasks.length || 0,
          upcomingCount: upcomingTasks.length || 0,
          totalCount: result.totalCount,
          completed: {
            count: completedTasks.length || 0,
            percentile: this.getPercentile(completedTasks.length, result.totalCount) || 0
          },
          pending: {
            count: pendingTasks.length || 0,
            percentile: this.getPercentile(pendingTasks.length, result.totalCount) || 0
          }
        }
        this.loadingTaskOverview = 'success';
			},
      error: err => {
        this.loadingTaskOverview = 'error';
      }
    })
  }

  isDue(inputDate: any) {
    const today = new Date();
    const date = new Date(inputDate);
  
    return today > date;
  }

  isUpcoming(inputDate: any) {
    const today = new Date();
    const date = new Date(inputDate);
  
    return date > today;
  }

  loadWalletBalance() {
    this.loadingWalletBalance = 'loading';

    //TODO: use RxJS
    this.hackerService.getWalletBalance().subscribe({
      next: result => {
        this.walletBalance = result.balance;
        this.loadingWalletBalance = 'success';
			},
      error: err => {
        this.loadingWalletBalance = 'error';
			}
    })
  }

  getPercentile(partialValue: any, totalValue: any) {
    return (100 * partialValue) / totalValue;
  }
  
  loadBountyActivity() {
    this.loadingBountyActivity = 'loading';

    this.hackerService.getHackerBountyActivity().subscribe({
      next: result => {
        this.bountyActivity = result.data;
        this.loadingBountyActivity = 'success';
			},
      error: err => {
        this.loadingBountyActivity = 'error';
			}
    })
  }

  withdraw() {
    const dialogRef = this.dialog.open(WithdrawDialogComponent, {
      height: '500px',
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result.event == DialogActions.Update){
        this.loadWalletBalance();
      }
    });
  }

  toggleSideNav() {
    this.sideNavOpened = !this.sideNavOpened;
  }

  logout() {
    this.oidcSecurityService.logoff();
  }
}
