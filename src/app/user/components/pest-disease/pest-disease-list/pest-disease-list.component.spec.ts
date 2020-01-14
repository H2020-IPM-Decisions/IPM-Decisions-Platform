import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PestDiseaseListComponent } from './pest-disease-list.component';

describe('PestDiseaseListComponent', () => {
  let component: PestDiseaseListComponent;
  let fixture: ComponentFixture<PestDiseaseListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PestDiseaseListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PestDiseaseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
