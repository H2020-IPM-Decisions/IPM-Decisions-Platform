import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DssOutputsDescriptionComponent } from './dss-outputs-description.component';

describe('DssOutputsDescriptionComponent', () => {
  let component: DssOutputsDescriptionComponent;
  let fixture: ComponentFixture<DssOutputsDescriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DssOutputsDescriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DssOutputsDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
