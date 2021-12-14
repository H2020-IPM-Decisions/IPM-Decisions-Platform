import { switchMap } from 'rxjs/operators';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TranslationService } from '@app/shared/services/translation.service';
import { Subscription } from 'rxjs';

@Component({
    selector: "app-language-selector",
    templateUrl: "./language-selector.component.html",
    styleUrls: ["./language-selector.component.css", "../home/./style.css"],
})

export class LanguageSelectorComponent implements OnInit, OnDestroy {
   /* currentLanguage: string;
    languages: any [] = [
      { description :'Language_Selector.English',  id:"en" },
      { description :'Language_Selector.Italian',  id:"it" }
    ];*/
    labelEnglish: string;
    labelItalian: string;
    selectedCountryCode: string;
    customLabels: Record<string,string>;
    countryCodes: string[];

    subscriptionLanguage: Subscription;

    constructor(
        private _translationService: TranslationService,
        private _translate: TranslateService
      ) {
        this._translationService.initLanguage();
        this.initLanguageLabels();
      }

    ngOnInit() {
      this.selectedCountryCode = this._translationService.getCurrentLanguage();
      this.countryCodes = ['gb','it'];
    }

    setLanguage(language: string): void {
      this._translationService.useLanguage(language);
    }

    changeSelectedCountryCode(value: string): void {
      this.selectedCountryCode = value;
      if (value==="gb") {
        this._translationService.useLanguage("en");
      } else {
        this._translationService.useLanguage(value);
      }
    }

    getCurrentCountryCode(): string {
      return this.selectedCountryCode;
    }

    initLanguageLabels(): void {
      this.subscriptionLanguage = this._translate.get('Language_Selector.English').pipe(
        switchMap((enTranslation) => {
          this.labelEnglish = enTranslation;
          return this._translate.get('Language_Selector.Italian')})
      ).subscribe((itTranslation)=> {
        this.labelItalian = itTranslation;
        this.customLabels = {
          "gb":this.labelEnglish,
          "it":this.labelItalian,
        };
      });      
    }

    ngOnDestroy() {
      this.subscriptionLanguage.unsubscribe();
    }

    /*initLanguage(): void {
        if (sessionStorage.getItem("selectedLanguage")) {
          this.currentLanguage = sessionStorage.getItem("selectedLanguage");
          this._translate.use(this.currentLanguage);
        } else {
          this.currentLanguage = "en"
          sessionStorage.setItem("selectedLanguage",this.currentLanguage)
          this._translate.use(this.currentLanguage);
        }
    }
    
    useLanguage(language: string): void {
        sessionStorage.setItem("selectedLanguage",language)
        this.currentLanguage = language;
        this._translate.use(language);
        window.location.reload();
    }*/
}