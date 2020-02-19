import { Component, OnInit, Input } from '@angular/core';
import { CMSService } from 'src/app/shared/services/cms.service';

@Component({
  selector: 'admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.css']
})
export class AdminHeaderComponent implements OnInit {

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
