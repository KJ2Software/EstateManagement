import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalItemComponent } from './approval-item.component';

describe('ApprovalItemComponent', () => {
  let component: ApprovalItemComponent;
  let fixture: ComponentFixture<ApprovalItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApprovalItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovalItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
