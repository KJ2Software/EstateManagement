import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EstateDialogComponent } from './estate-dialog.component';

describe('EstateDialogComponent', () => {
  let component: EstateDialogComponent;
  let fixture: ComponentFixture<EstateDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EstateDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
