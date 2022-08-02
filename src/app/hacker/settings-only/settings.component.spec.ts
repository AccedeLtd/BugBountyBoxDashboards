import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsOnlyComponent } from './settings.component';

describe('SettingsOnlyComponent', () => {
  let component: SettingsOnlyComponent;
  let fixture: ComponentFixture<SettingsOnlyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingsOnlyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsOnlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
