import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BugsReportsComponent } from './bugs-reports.component';

describe('BugsReportsComponent', () => {
  let component: BugsReportsComponent;
  let fixture: ComponentFixture<BugsReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BugsReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BugsReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
