import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DssSelectionComponent } from './dss-selection.component';

describe('DssSelectionComponent', () => {
  let component: DssSelectionComponent;
  let fixture: ComponentFixture<DssSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DssSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DssSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
