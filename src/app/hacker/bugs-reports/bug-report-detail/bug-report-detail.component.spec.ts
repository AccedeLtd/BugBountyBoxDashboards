import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BugReportDetailComponent } from './bug-report-detail.component';

describe('BugReportDetailComponent', () => {
  let component: BugReportDetailComponent;
  let fixture: ComponentFixture<BugReportDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BugReportDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BugReportDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
