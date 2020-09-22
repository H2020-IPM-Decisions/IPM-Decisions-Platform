import { TestBed } from '@angular/core/testing';

import { SidebarMenuUpdateService } from './sidebar-menu-update.service';

describe('SidebarMenuUpdateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SidebarMenuUpdateService = TestBed.get(SidebarMenuUpdateService);
    expect(service).toBeTruthy();
  });
});
