import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DssParametersDescriptionComponent } from './dss-parameters-description.component';

describe('DssParametersDescriptionComponent', () => {
  let component: DssParametersDescriptionComponent;
  let fixture: ComponentFixture<DssParametersDescriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DssParametersDescriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DssParametersDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
