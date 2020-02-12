import { Component, OnInit, Input } from '@angular/core';
import { CMSService } from 'src/app/shared/services/cms.service';

@Component({
  selector: 'user-header',
  templateUrl: './user-header.component.html',
  styleUrls: ['./user-header.component.css']
})
export class UserHeaderComponent implements OnInit {

  @Input() active;
  bannerUrl = "";

  constructor(
    private cmsService: CMSService
  ) { }

  ngOnInit() {
    this.cmsService
      .getBanner()
      .then((response: any) => { this.bannerUrl = response.image.path });
  }

}
