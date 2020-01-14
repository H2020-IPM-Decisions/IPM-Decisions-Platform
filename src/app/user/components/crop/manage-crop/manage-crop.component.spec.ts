import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCropComponent } from './manage-crop.component';

describe('ManageCropComponent', () => {
  let component: ManageCropComponent;
  let fixture: ComponentFixture<ManageCropComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageCropComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageCropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
