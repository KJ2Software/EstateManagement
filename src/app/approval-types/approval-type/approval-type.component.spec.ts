import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalTypeComponent } from './approval-type.component';

describe('ApprovalTypeComponent', () => {
  let component: ApprovalTypeComponent;
  let fixture: ComponentFixture<ApprovalTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApprovalTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovalTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
