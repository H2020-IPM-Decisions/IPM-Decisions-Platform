import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarMenuUpdateService {

  private menuSource = new BehaviorSubject<string>("farm");
  currentMenu = this.menuSource.asObservable();

  constructor() { }

  changeSidebarMenu(menuItem: string) {
    this.menuSource.next(menuItem);
  }
}
