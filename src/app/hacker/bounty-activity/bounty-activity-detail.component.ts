import { Component, Inject } from '@angular/core';
import { concatMap, filter, map, switchMap } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { DOCUMENT } from '@angular/common';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { HackerService } from 'src/app/core/_services/hacker.service';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { NotificationService } from 'src/app/core/_services/notification.service';

@Component({
  selector: 'app-bounty-activity-detail',
  templateUrl: './bounty-activity-detail.component.html',
  styleUrls: ['./bounty-activity-detail.component.css']
})
export class BountyActivityDetailComponent {
  searchInput!: string;
  sideNavOpened = false;  
  showReportForm: boolean = false;
  user: any;
  authUser: any;
  userName: any;
  loading: boolean = true;
  isError: boolean = false;
  hacker: any;
  bountyActivities: any;
  ratings: any;
  loadingFollowing: boolean = false;

  constructor(
    @Inject(DOCUMENT) public document: Document,
    public oidcSecurityService: OidcSecurityService,
    public hackerService: HackerService,
    public notifyService: NotificationService,
    public route: ActivatedRoute,
  ) {

  }

  ngOnInit(): void {
    this.getBountyActivityDetails();
	}

  getBountyActivityDetails() {
    this.loading = true;
    this.route.paramMap.pipe(
      switchMap(paramMap => {
        const id = paramMap.get('id');
        return forkJoin([
          this.hackerService.getHacker(),
          this.hackerService.getHackerByUserId(id),
          this.hackerService.getBountyActivityByHackerId(id),
          // this.hackerService.getRatingsByHackerId(id),
        ])
      })).subscribe({
        next: ([me, hacker, bountyActivities]) => {
          const isFollowing = me.followings.find((f:any) => f.userId == hacker.userId);
          // console.log(isFollowing);
          
          this.hacker = hacker;
          isFollowing ? this.hacker.isFollowing = true : this.hacker.isFollowing = false;
          this.bountyActivities = bountyActivities;
          // this.ratings = ratings;
          this.isError = false;
          this.loading = false;
        },
        error: () => {
          this.isError = true;
          this.loading = false;
        }
      })
  }

  toggleSideNav() {
    this.sideNavOpened = !this.sideNavOpened;
  }

  logout() {
    this.oidcSecurityService.logoff();
  }

  toggleReportForm() {
    this.showReportForm = !this.showReportForm;
  }
  
  followHacker(userId: any) {
    this.loadingFollowing = true;
    this.hackerService.followHacker(userId).subscribe({
      next: result => {
        this.notifyService.showSuccess(`You are now following ${this.hacker.userName}`, 'Success');
        this.hacker.isFollowing = true;
        this.loadingFollowing = false;
      },
      error: error => {
        this.notifyService.showError(`Something went wrong following ${this.hacker.userName}, please try again`, 'Error');
        this.loadingFollowing = false;
      }
    })
  }
  
  unfollowHacker(userId: any) {
    this.loadingFollowing = true;
    this.hackerService.unfollowHacker(userId).subscribe({
      next: result => {
        this.notifyService.showSuccess(`You unfollowed ${this.hacker.userName}`, 'Success');
        this.hacker.isFollowing = false;
        this.loadingFollowing = false;
      },
      error: error => {
        this.notifyService.showError(`Something went wrong unfollowing ${this.hacker.userName}, please try again`, 'Error');
        this.loadingFollowing = false;
      }
    })
  }
}