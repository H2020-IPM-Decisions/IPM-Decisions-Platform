import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CMSService } from '@app/shared/services/cms.service';
declare var init: any;
declare var home: any;

@Component({
  selector: 'app-developers-article',
  templateUrl: './developers-article.component.html',
  styleUrls: ['./developers-article.component.css', '../home/./style.css']
})
export class DevelopersArticleComponent implements OnInit {

  bannerUrl = "";

  constructor(
    private router: Router,
    private cmsService: CMSService
  ) { }

  ngOnInit() {
    home();
    let cmsService = this.cmsService;
    let promises = [
      cmsService.getBanner()
        .then((response: any) => { this.bannerUrl = response.image.path })
    ];
    Promise.all(promises).then(() => {
      setTimeout(() => init(), 0)
    })
  }

  goToRegistrationPage() {
    this.router.navigate(['/login'])
      .then(()=>{
        document.getElementById('register-button').click();
      });
  }

}
