import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmRequestComponent } from './farm-request.component';

describe('FarmRequestComponent', () => {
  let component: FarmRequestComponent;
  let fixture: ComponentFixture<FarmRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FarmRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FarmRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
