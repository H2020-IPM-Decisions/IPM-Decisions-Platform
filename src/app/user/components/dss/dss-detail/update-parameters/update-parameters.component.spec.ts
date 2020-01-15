import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateParametersComponent } from './update-parameters.component';

describe('UpdateParametersComponent', () => {
  let component: UpdateParametersComponent;
  let fixture: ComponentFixture<UpdateParametersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateParametersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateParametersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
