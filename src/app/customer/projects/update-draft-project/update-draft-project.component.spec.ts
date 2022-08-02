import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateDraftProjectComponent } from './update-draft-project.component';

describe('UpdateDraftProjectComponent', () => {
  let component: UpdateDraftProjectComponent;
  let fixture: ComponentFixture<UpdateDraftProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateDraftProjectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateDraftProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
