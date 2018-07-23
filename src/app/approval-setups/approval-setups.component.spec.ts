import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalSetupsComponent } from './approval-setups.component';

describe('ApprovalSetupsComponent', () => {
  let component: ApprovalSetupsComponent;
  let fixture: ComponentFixture<ApprovalSetupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApprovalSetupsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovalSetupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
