import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'user-header',
  templateUrl: './user-header.component.html',
  styleUrls: ['./user-header.component.css']
})
export class UserHeaderComponent implements OnInit {

  @Input() active;
  constructor() { }

  ngOnInit() {
  }

}
