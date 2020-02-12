import { Component, OnInit } from '@angular/core';
import { CMSService } from '../../services/cms.service';


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  footer = "";

  constructor(
    private cmsService: CMSService
  ) { }

  ngOnInit() {
    this.cmsService
      .getFooter()
      .then((response: any) => { this.footer = response.content; });
  }

}
