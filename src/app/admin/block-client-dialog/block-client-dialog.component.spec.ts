import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockClientDialogComponent } from './block-client-dialog.component';

describe('BlockClientDialogComponent', () => {
  let component: BlockClientDialogComponent;
  let fixture: ComponentFixture<BlockClientDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlockClientDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockClientDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
