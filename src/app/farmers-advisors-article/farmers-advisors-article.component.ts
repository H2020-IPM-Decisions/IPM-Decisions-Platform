import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CMSService } from '@app/shared/services/cms.service';
import { DomSanitizer } from '@angular/platform-browser'
declare var init: any;
declare var home: any;

@Component({
  selector: 'app-farmers-advisors-article',
  templateUrl: './farmers-advisors-article.component.html',
  styleUrls: ['./farmers-advisors-article.component.css', '../home/./style.css']
})
export class FarmersAdvisorsArticleComponent implements OnInit {

  bannerUrl = "";
  articleContent: any;

  constructor(
    private router: Router,
    private cmsService: CMSService,
    private _sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    home();
    let cmsService = this.cmsService;
    let promises = [
      cmsService.getBanner()
        .then((response: any) => { this.bannerUrl = response.image.path }),
      
      cmsService.getFarmersAdvisorsArticle()
        .then((fArticle: any) => {
          let languageFound: boolean = false;
          for (let key in fArticle) {
            if(key === sessionStorage.getItem("selectedLanguage"))
            {
              this.articleContent = this._sanitizer.bypassSecurityTrustHtml(fArticle[key]);
              languageFound = true;
              if (fArticle[key]==="") {
                this.articleContent = this._sanitizer.bypassSecurityTrustHtml(fArticle["en"]);
              }
            }
          }
          if(!languageFound) {
            this.articleContent = this._sanitizer.bypassSecurityTrustHtml(fArticle["en"]);
          }
        }),
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
