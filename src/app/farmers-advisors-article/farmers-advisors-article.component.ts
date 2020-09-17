import { Component, OnInit } from '@angular/core';
import { CMSService } from '@app/shared/services/cms.service';
declare var init: any;

@Component({
  selector: 'app-farmers-advisors-article',
  templateUrl: './farmers-advisors-article.component.html',
  styleUrls: ['./farmers-advisors-article.component.css']
})
export class FarmersAdvisorsArticleComponent implements OnInit {

  bannerUrl = "";

  constructor(
    private cmsService: CMSService
  ) { }

  ngOnInit() {
    let cmsService = this.cmsService;
    let promises = [
      cmsService.getBanner()
        .then((response: any) => { this.bannerUrl = response.image.path })
    ];
    Promise.all(promises).then(() => {
      setTimeout(() => init(), 0)
    })
  }

}
