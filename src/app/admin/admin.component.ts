import { Component, OnInit } from '@angular/core';
declare var init: any;

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {


  constructor(
  ) { }

  ngOnInit() {
    init()
  }

}
