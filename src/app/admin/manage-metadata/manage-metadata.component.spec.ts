import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageMetadataComponent } from './manage-metadata.component';

describe('ManageMetadataComponent', () => {
  let component: ManageMetadataComponent;
  let fixture: ComponentFixture<ManageMetadataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageMetadataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageMetadataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
