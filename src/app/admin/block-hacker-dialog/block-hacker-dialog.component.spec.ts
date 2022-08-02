import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockHackerDialogComponent } from './block-hacker-dialog.component';

describe('BlockHackerDialogComponent', () => {
  let component: BlockHackerDialogComponent;
  let fixture: ComponentFixture<BlockHackerDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlockHackerDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockHackerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
