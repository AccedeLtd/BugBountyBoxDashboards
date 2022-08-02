import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BountyActivityComponent } from './bounty-activity.component';

describe('BountyActivityComponent', () => {
  let component: BountyActivityComponent;
  let fixture: ComponentFixture<BountyActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BountyActivityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BountyActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
