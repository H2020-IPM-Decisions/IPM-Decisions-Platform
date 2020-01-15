import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DssAdaptationDashboardComponent } from './dss-adaptation-dashboard.component';

describe('DssAdaptationDashboardComponent', () => {
  let component: DssAdaptationDashboardComponent;
  let fixture: ComponentFixture<DssAdaptationDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DssAdaptationDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DssAdaptationDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
