import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasetRepositoryComponent } from './dataset-repository.component';

describe('DatasetRepositoryComponent', () => {
  let component: DatasetRepositoryComponent;
  let fixture: ComponentFixture<DatasetRepositoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatasetRepositoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasetRepositoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
