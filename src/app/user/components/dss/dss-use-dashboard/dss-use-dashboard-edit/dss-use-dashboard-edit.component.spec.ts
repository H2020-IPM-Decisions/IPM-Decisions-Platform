import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DssUseDashboardEditComponent } from './dss-use-dashboard-edit.component';

describe('DssUseDashboardEditComponent', () => {
  let component: DssUseDashboardEditComponent;
  let fixture: ComponentFixture<DssUseDashboardEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DssUseDashboardEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DssUseDashboardEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
