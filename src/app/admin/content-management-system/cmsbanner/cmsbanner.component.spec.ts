import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CMSBannerComponent } from './cmsbanner.component';

describe('CMSBannerComponent', () => {
  let component: CMSBannerComponent;
  let fixture: ComponentFixture<CMSBannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CMSBannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CMSBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
