import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DssInputsDescriptionComponent } from './dss-inputs-description.component';

describe('DssInputsDescriptionComponent', () => {
  let component: DssInputsDescriptionComponent;
  let fixture: ComponentFixture<DssInputsDescriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DssInputsDescriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DssInputsDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
