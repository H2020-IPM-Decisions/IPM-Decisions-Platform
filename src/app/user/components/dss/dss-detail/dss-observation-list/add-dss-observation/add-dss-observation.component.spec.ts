import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDssObservationComponent } from './add-dss-observation.component';

describe('AddDssObservationComponent', () => {
  let component: AddDssObservationComponent;
  let fixture: ComponentFixture<AddDssObservationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDssObservationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDssObservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
