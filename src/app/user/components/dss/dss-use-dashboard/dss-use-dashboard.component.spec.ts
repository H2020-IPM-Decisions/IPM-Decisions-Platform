import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DssUseDashboardComponent } from './dss-use-dashboard.component';

describe('DssUseDashboardComponent', () => {
  let component: DssUseDashboardComponent;
  let fixture: ComponentFixture<DssUseDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DssUseDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DssUseDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
