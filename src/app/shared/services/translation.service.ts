import { Subscription } from 'rxjs';
import { Injectable } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Injectable({
    providedIn: 'root'
})

export class TranslationService {
    currentLanguage: string;
    translatedMessage: string;

    $messageTranslationSubscription: Subscription;

    constructor(
        private _translate: TranslateService
      ) {    
        this.initLanguage();
    }

    public initLanguage(): void {
        if (sessionStorage.getItem("selectedLanguage")) {
          this.currentLanguage = sessionStorage.getItem("selectedLanguage");
          this._translate.use(this.currentLanguage);
        } else {
          this.initLanguageFromBrowser();
        }
    }

    public initLanguageFromBrowser(): void {
      this.currentLanguage = this._translate.getBrowserLang();
      sessionStorage.setItem("selectedLanguage",this.currentLanguage.match(/en|el|se|de|nl|sl|no|dk|fi|it/) ? this.currentLanguage : 'en')
      this._translate.use(this.currentLanguage.match(/en|el|se|de|nl|sl|no|dk|fi|it/) ? this.currentLanguage : 'en');
    }

    public useLanguage(language: string): void {
        sessionStorage.setItem("selectedLanguage",language)
        this.currentLanguage = language;
        this._translate.use(language);
        window.location.reload();
    }

    public getCurrentLanguage(): string {
      /*if (this.currentLanguage==="en"){
        return "gb";
      }
        return this.currentLanguage;*/
      return this.convertLangToFlagCode(this.currentLanguage);
    }
    
    public convertFlagToLangCode(flagCode: string): string {
      let flagToLangCodeMap: {[key: string]: string} = {
        "gb":"en",
        "it":"it",
        "gr":"el",
        "se":"se",
        "fr":"fr",
        "de":"de",
        "nl":"nl",
        "si":"sl",
        "fi":"fi",
        "no":"no",
        "lt":"lt",
        "dk":"dk"
      };
      return flagToLangCodeMap[flagCode];
    }

    public convertLangToFlagCode(langCode: string): string {
      let langToFlagCode: {[key: string]: string} = {
        "en":"gb",
        "it":"it",
        "el":"gr",
        "se":"se",
        "fr":"fr",
        "de":"de",
        "nl":"nl",
        "sl":"si",
        "fi":"fi",
        "no":"no",
        "lt":"lt",
        "dk":"dk"
      };
      return langToFlagCode[langCode];
    }

    public convertLangToMomentCode(langCode: string): string {
      let langToFlagCode: {[key: string]: string} = {
        "en":"gb",
        "it":"it",
        "el":"el",
        "se":"sv",
        "fr":"fr",
        "de":"de",
        "nl":"nl",
        "sl":"sl",
        "fi":"fi",
        "no":"nn",
        "lt":"lt",
        "dk":"da"
      };
      return langToFlagCode[langCode];
    }

    private initMessageToTranslate(messageKeyToTranslate: string): void {
      if(this.$messageTranslationSubscription){
        this.$messageTranslationSubscription.unsubscribe();
      }
      this.$messageTranslationSubscription = this._translate.get(messageKeyToTranslate).subscribe((translation)=> {
        this.translatedMessage = translation;
      });      
    }

    public getTranslatedMessage(keyOfMessage: string): string {
      this.initMessageToTranslate(keyOfMessage)
      return this.translatedMessage;
    }
}