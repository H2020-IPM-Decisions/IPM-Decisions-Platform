import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DssPlatformStatusComponent } from './dss-platform-status.component';

describe('DssPlatformStatusComponent', () => {
  let component: DssPlatformStatusComponent;
  let fixture: ComponentFixture<DssPlatformStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DssPlatformStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DssPlatformStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
