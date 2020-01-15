import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DssDetailComponent } from './dss-detail.component';

describe('DssDetailComponent', () => {
  let component: DssDetailComponent;
  let fixture: ComponentFixture<DssDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DssDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DssDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
