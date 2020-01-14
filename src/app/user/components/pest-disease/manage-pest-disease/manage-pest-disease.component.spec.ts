import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagePestDiseaseComponent } from './manage-pest-disease.component';

describe('ManagePestDiseaseComponent', () => {
  let component: ManagePestDiseaseComponent;
  let fixture: ComponentFixture<ManagePestDiseaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagePestDiseaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagePestDiseaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
