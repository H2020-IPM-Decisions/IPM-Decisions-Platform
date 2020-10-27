import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAdvancedFarmComponent } from './crop-pest-combination.component';

describe('AddAdvancedFarmComponent', () => {
  let component: AddAdvancedFarmComponent;
  let fixture: ComponentFixture<AddAdvancedFarmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAdvancedFarmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAdvancedFarmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
