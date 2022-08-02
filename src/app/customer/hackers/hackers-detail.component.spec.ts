import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HackersDetailComponent } from './hackers-detail.component';

describe('HackersDetailComponent', () => {
  let component: HackersDetailComponent;
  let fixture: ComponentFixture<HackersDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HackersDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HackersDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
