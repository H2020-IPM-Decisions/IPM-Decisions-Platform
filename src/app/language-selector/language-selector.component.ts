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
    
    /* 
      LANGUAGE LABELS
    */
    labelEnglish: string;
    labelItalian: string;
    labelGreek: string;
    labelSwedish: string;
    labelFrench: string;
    labelGerman: string;
    labelDutch: string;
    labelSlovenian: string;
    labelFinnish: string;
    labelNorwegian: string;
    labelLithuanian: string;
    labelDanish: any;

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

    /*
      Some country flags uses a different code see the below list:
      FLAG CODE | LANG CODE | COUNTRY
          gb    |    en     | Great Britain
          gr    |    el     | Greek
    */
    ngOnInit() {
      this.selectedCountryCode = this._translationService.getCurrentLanguage();
      this.countryCodes = ['gb','it','gr','se',/*'fr'*/,'de','nl','si','fi','no',/*'lt'*/,'dk'];
    }

    setLanguage(language: string): void {
      this._translationService.useLanguage(language);
    }

    changeSelectedCountryCode(value: string): void {
      this.selectedCountryCode = value;
      let convertedValue: string = this._translationService.convertFlagToLangCode(value);
      /*if (value==="gb") {
        this._translationService.useLanguage("en");
      } else {
        this._translationService.useLanguage(value);
      }*/
      this._translationService.useLanguage(convertedValue);
    }

    getCurrentCountryCode(): string {
      return this.selectedCountryCode;
    }

    initLanguageLabels(): void {
      this.subscriptionLanguage = this._translate.get('Language_Selector.English').pipe(
        switchMap((enTranslation) => {
          this.labelEnglish = enTranslation;
          return this._translate.get('Language_Selector.Greek')}),
        switchMap((elTranslation) => {
          this.labelGreek = elTranslation;
          return this._translate.get('Language_Selector.Swedish')}),
        switchMap((seTranslation) => {
          this.labelSwedish = seTranslation;
          return this._translate.get('Language_Selector.French')}),
        switchMap((frTranslation) => {
          this.labelFrench = frTranslation;
          return this._translate.get('Language_Selector.German')}),
        switchMap((deTranslation) => {
          this.labelGerman = deTranslation;
          return this._translate.get('Language_Selector.Dutch')}),
        switchMap((nlTranslation) => {
          this.labelDutch = nlTranslation;
          return this._translate.get('Language_Selector.Slovenian')}),
        switchMap((siTranslation) => {
          this.labelSlovenian = siTranslation;
          return this._translate.get('Language_Selector.Finnish')}),
        switchMap((fiTranslation) => {
          this.labelFinnish = fiTranslation;
          return this._translate.get('Language_Selector.Norwegian')}),
        switchMap((noTranslation) => {
          this.labelNorwegian = noTranslation;
          return this._translate.get('Language_Selector.Lithuanian')}),
        switchMap((ltTranslation) => {
            this.labelLithuanian = ltTranslation;
            return this._translate.get('Language_Selector.Italian')}),
        switchMap((itTranslation) => {
          this.labelItalian = itTranslation;
          return this._translate.get('Language_Selector.Danish')}),
      ).subscribe((dkTranslation)=> {
        this.labelDanish = dkTranslation;
        this.customLabels = {
          "gb":this.labelEnglish,
          "it":this.labelItalian,
          "gr":this.labelGreek,
          "se":this.labelSwedish,
          "fr":this.labelFrench,
          "de":this.labelGerman,
          "nl":this.labelDutch,
          "si":this.labelSlovenian,
          "fi":this.labelFinnish,
          "no":this.labelNorwegian,
          "lt":this.labelLithuanian,
          "dk":this.labelDanish
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