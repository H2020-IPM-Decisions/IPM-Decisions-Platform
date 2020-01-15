import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DssObservationListComponent } from './dss-observation-list.component';

describe('DssObservationListComponent', () => {
  let component: DssObservationListComponent;
  let fixture: ComponentFixture<DssObservationListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DssObservationListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DssObservationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
