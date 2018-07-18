import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalTypesComponent } from './approval-types.component';

describe('ApprovalTypesComponent', () => {
  let component: ApprovalTypesComponent;
  let fixture: ComponentFixture<ApprovalTypesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApprovalTypesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovalTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
