import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPestDiseaseComponent } from './add-pest-disease.component';

describe('AddPestDiseaseComponent', () => {
  let component: AddPestDiseaseComponent;
  let fixture: ComponentFixture<AddPestDiseaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPestDiseaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPestDiseaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
