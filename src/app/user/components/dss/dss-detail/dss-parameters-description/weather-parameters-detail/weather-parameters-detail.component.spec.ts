import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeatherParametersDetailComponent } from './weather-parameters-detail.component';

describe('WeatherParametersDetailComponent', () => {
  let component: WeatherParametersDetailComponent;
  let fixture: ComponentFixture<WeatherParametersDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeatherParametersDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeatherParametersDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
