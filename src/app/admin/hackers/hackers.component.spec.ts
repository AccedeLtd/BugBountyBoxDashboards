import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HackersComponent } from './hackers.component';

describe('HackersComponent', () => {
  let component: HackersComponent;
  let fixture: ComponentFixture<HackersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HackersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HackersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
