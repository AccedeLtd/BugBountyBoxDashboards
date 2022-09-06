import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnDestroy } from '@angular/core';
import { map, shareReplay, Subject, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-hacker',
  templateUrl: './hacker.component.html',
  styleUrls: ['./hacker.component.css'],
})
export class HackerComponent implements OnDestroy {
  isHandset: boolean;
  private isDestroyed$ = new Subject<boolean>();

  constructor(breakpointObserver: BreakpointObserver) {
    const breakpoint = '(max-width: 1024px)';
    this.isHandset = breakpointObserver.isMatched(breakpoint);
    breakpointObserver
      .observe(breakpoint)
      .pipe(
        map((result) => result.matches),
        takeUntil(this.isDestroyed$)
      )
      .subscribe((isHandset) => (this.isHandset = isHandset));
  }

  ngOnDestroy(): void {
    this.isDestroyed$.next(true);
  }
}
