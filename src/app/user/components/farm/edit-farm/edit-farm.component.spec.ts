import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFarmComponent } from './edit-farm.component';

describe('EditFarmComponent', () => {
  let component: EditFarmComponent;
  let fixture: ComponentFixture<EditFarmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditFarmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditFarmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
