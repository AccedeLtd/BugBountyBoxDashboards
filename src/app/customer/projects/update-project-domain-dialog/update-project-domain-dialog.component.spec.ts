import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateProjectDomainDialogComponent } from './update-project-domain-dialog.component';

describe('UpdateProjectDomainDialogComponent', () => {
  let component: UpdateProjectDomainDialogComponent;
  let fixture: ComponentFixture<UpdateProjectDomainDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateProjectDomainDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateProjectDomainDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
