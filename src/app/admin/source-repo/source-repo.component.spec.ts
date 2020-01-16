import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SourceRepoComponent } from './source-repo.component';

describe('SourceRepoComponent', () => {
  let component: SourceRepoComponent;
  let fixture: ComponentFixture<SourceRepoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SourceRepoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SourceRepoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
