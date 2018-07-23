import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateApprovalComponent } from './create-approval.component';

describe('CreateApprovalComponent', () => {
  let component: CreateApprovalComponent;
  let fixture: ComponentFixture<CreateApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
