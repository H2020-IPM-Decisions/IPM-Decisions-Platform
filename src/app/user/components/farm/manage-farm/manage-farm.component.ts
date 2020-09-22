import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-manage-farm',
  templateUrl: './manage-farm.component.html',
  styleUrls: ['./manage-farm.component.css']
})
export class ManageFarmComponent implements OnInit {

  elements: any = [];
  middleTblElements: any = [];
  leftHeadElements = ['spray', 'date', 'rate'];
  middleHeadElements = ['date', 'severity'];

  ngOnInit() {
    for (let i = 1; i <= 1; i++) {
      this.elements.push({ spray: i, date: 'User ' + i, rate: 'Name ' + i });
    }
    for (let i = 1; i <= 3; i++) {
      this.middleTblElements.push({ date: 'Date ' + i, severity: 'Severity ' + i });
    }
  }

}
