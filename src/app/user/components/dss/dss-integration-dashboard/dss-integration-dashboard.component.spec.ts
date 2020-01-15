import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DssIntegrationDashboardComponent } from './dss-integration-dashboard.component';

describe('DssIntegrationDashboardComponent', () => {
  let component: DssIntegrationDashboardComponent;
  let fixture: ComponentFixture<DssIntegrationDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DssIntegrationDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DssIntegrationDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
