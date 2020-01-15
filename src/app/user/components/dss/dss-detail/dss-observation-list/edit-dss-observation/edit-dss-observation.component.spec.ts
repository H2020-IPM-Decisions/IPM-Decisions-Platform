import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDssObservationComponent } from './edit-dss-observation.component';

describe('EditDssObservationComponent', () => {
  let component: EditDssObservationComponent;
  let fixture: ComponentFixture<EditDssObservationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditDssObservationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDssObservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
