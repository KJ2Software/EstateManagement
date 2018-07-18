import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalTypeAddModifyComponent } from './approval-type-add-modify.component';

describe('ApprovalTypeAddModifyComponent', () => {
  let component: ApprovalTypeAddModifyComponent;
  let fixture: ComponentFixture<ApprovalTypeAddModifyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApprovalTypeAddModifyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovalTypeAddModifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
