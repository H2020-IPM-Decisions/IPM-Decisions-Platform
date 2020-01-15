import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DssStatusDetailComponent } from './dss-status-detail.component';

describe('DssStatusDetailComponent', () => {
  let component: DssStatusDetailComponent;
  let fixture: ComponentFixture<DssStatusDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DssStatusDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DssStatusDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
