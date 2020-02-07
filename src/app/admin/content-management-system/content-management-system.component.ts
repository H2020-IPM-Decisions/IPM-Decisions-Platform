import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-content-management-system',
  templateUrl: './content-management-system.component.html',
  styleUrls: ['./content-management-system.component.css']
})
export class ContentManagementSystemComponent implements OnInit {

  contentComponent = "banner"

  constructor() { }

  ngOnInit() {
  }

}
