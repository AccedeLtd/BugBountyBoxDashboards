import { Component, OnInit } from '@angular/core';
import { HackerService } from 'src/app/core/_services/hacker.service';
import LoadStatus from 'src/app/core/_utils/LoadStatus';

@Component({
  selector: 'app-recent-updates',
  templateUrl: './recent-updates.component.html',
  styleUrls: ['./recent-updates.component.css']
})
export class RecentUpdatesComponent implements OnInit {
  bountyStats: any;
  loadingBountyStats: LoadStatus = 'loading';

  constructor(
    public hackerService: HackerService,
  ) { }

  ngOnInit(): void {
    this.loadBountyStats();
  }

  loadBountyStats() {
    this.loadingBountyStats = 'loading';

    this.hackerService.getBountyStats().subscribe({
      next: result => {
        this.bountyStats = result;
        this.loadingBountyStats = 'success';
			},
      error: err => {
        this.loadingBountyStats = 'error';
			}
    })
  }

}
