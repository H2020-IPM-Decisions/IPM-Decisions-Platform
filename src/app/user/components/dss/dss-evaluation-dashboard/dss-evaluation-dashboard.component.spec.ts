import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DssEvaluationDashboardComponent } from './dss-evaluation-dashboard.component';

describe('DssEvaluationDashboardComponent', () => {
  let component: DssEvaluationDashboardComponent;
  let fixture: ComponentFixture<DssEvaluationDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DssEvaluationDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DssEvaluationDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
