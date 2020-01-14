import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCatalogueComponent } from './manage-catalogue.component';

describe('ManageCatalogueComponent', () => {
  let component: ManageCatalogueComponent;
  let fixture: ComponentFixture<ManageCatalogueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageCatalogueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageCatalogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
