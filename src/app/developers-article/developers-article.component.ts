import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CMSService } from '@app/shared/services/cms.service';
import { DomSanitizer } from '@angular/platform-browser'
import { AuthenticationService } from '@app/core/auth/services/authentication.service';
import { Subscription, timer } from 'rxjs';

declare var init: any;
declare var home: any;

@Component({
  selector: 'app-developers-article',
  templateUrl: './developers-article.component.html',
  styleUrls: ['./developers-article.component.css', '../home/./style.css']
})
export class DevelopersArticleComponent implements OnInit, OnDestroy {

  bannerUrl = "";
  articleContent: any;

  public isLoggedIn: boolean;
  public username: string;
  public $accountSub: Subscription;

  public sessionTimeLeftToShow: number;
  public $sessionExpirationTimer: Subscription;
  public $sessionExtend: Subscription;
  public sessionIsExpired: boolean = false;


  constructor(
    private router: Router,
    private cmsService: CMSService,
    private _sanitizer: DomSanitizer,
    private _authService: AuthenticationService
  ) { }

  ngOnInit() {
    home();
    let cmsService = this.cmsService;
    let promises = [
      cmsService.getBanner()
        .then((response: any) => { this.bannerUrl = response.image.path }),

      cmsService.getDevelopersArticle()
        .then((dArticle: any) => {
          let languageFound: boolean = false;
          for (let key in dArticle) {
            if(key === sessionStorage.getItem("selectedLanguage"))
            {
              this.articleContent = this._sanitizer.bypassSecurityTrustHtml(dArticle[key]);
              languageFound = true;
              if (dArticle[key]==="") {
                this.articleContent = this._sanitizer.bypassSecurityTrustHtml(dArticle["en"]);
              }
            }
          }
          if(!languageFound) {
            this.articleContent = this._sanitizer.bypassSecurityTrustHtml(dArticle["en"]);
          }
        }),
    ];
    Promise.all(promises).then(() => {
      setTimeout(() => init(), 0)
    })

    // Check if user is logged in
    this.isLoggedIn = this._authService.isLoggedIn();
    // Format the user name
    if(this.isLoggedIn){
      this.$accountSub = this._authService.account$.subscribe(
        (account) => {
          if(account !== null){this.username = (/(.*)@/).exec(account.email)[1];}
        }
      )
      // Start Session timer
      this.oberserableTimer();
    }
  }

  goToRegistrationPage() {
    this.router.navigate(['/login'])
      .then(()=>{
        document.getElementById('register-button').click();
      });
  }

  ngOnDestroy(): void {
    if(this.$accountSub){
      this.$accountSub.unsubscribe();
    }
    if (this.$sessionExtend) {
      this.$sessionExtend.unsubscribe();
    }
    if (this.$sessionExpirationTimer) {
      this.$sessionExpirationTimer.unsubscribe();
    }
  }

  navigateToPrivatePages(): void {
    const userHasDss: boolean = JSON.parse(sessionStorage.getItem("hasDSS"));
    if (userHasDss) {
      this.router.navigate(["/user/dss/dashboard"]);
    } else {
      this.router.navigate(["/user/farm"]);
    }
  }

  private oberserableTimer(): void {
    if (this.$sessionExpirationTimer) {
      this.$sessionExpirationTimer.unsubscribe();
    }
    const source = timer(0, 1000);
    this.$sessionExpirationTimer = source.subscribe(() => {
      this.sessionTimeLeftToShow = this._authService.getExpirationAsSeconds();
      if (this.sessionTimeLeftToShow < 1) {
        this.$sessionExpirationTimer.unsubscribe();
        this.sessionIsExpired = true;
      }
    });
  }

  public isSessionExpiring(): boolean {
    if(this.sessionTimeLeftToShow < 60){
      return true;
    }
    return false;
  }

  public extendSession(): void {
    if (this.$sessionExtend) {
      this.$sessionExtend.unsubscribe();
    }
    this.$sessionExtend = this._authService.authenticateWithRefreshToken(sessionStorage.getItem("refresh_token")).subscribe(()=>{
      this.oberserableTimer();
      this.sessionIsExpired = false;
    });
  }

}
