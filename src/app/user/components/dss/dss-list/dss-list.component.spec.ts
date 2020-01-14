import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DssListComponent } from './dss-list.component';

describe('DssListComponent', () => {
  let component: DssListComponent;
  let fixture: ComponentFixture<DssListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DssListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DssListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
