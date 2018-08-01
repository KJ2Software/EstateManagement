import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalItemsComponent } from './approval-items.component';

describe('ApprovalItemsComponent', () => {
  let component: ApprovalItemsComponent;
  let fixture: ComponentFixture<ApprovalItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApprovalItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovalItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
