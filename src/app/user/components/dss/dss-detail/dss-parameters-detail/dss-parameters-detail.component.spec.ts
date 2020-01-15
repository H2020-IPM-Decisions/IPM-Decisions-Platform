import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DssParametersDetailComponent } from './dss-parameters-detail.component';

describe('DssParametersDetailComponent', () => {
  let component: DssParametersDetailComponent;
  let fixture: ComponentFixture<DssParametersDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DssParametersDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DssParametersDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
