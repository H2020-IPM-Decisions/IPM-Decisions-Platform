import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CMSService } from '@app/shared/services/cms.service';
import { DomSanitizer } from '@angular/platform-browser'
declare var init: any;
declare var home: any;

@Component({
  selector: 'app-researchers-article',
  templateUrl: './researchers-article.component.html',
  styleUrls: ['./researchers-article.component.css', '../home/./style.css']
})
export class ResearchersArticleComponent implements OnInit {

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

      cmsService.getResearchersArticle()
        .then((rArticle: any) => {
          let languageFound: boolean = false;
          for (let key in rArticle) {
            if(key === sessionStorage.getItem("selectedLanguage"))
            {
              this.articleContent = this._sanitizer.bypassSecurityTrustHtml(rArticle[key]);
              languageFound = true;
              if (rArticle[key]==="") {
                this.articleContent = this._sanitizer.bypassSecurityTrustHtml(rArticle["en"]);
              }
            }
          }
          if(!languageFound) {
            this.articleContent = this._sanitizer.bypassSecurityTrustHtml(rArticle["en"]);
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
