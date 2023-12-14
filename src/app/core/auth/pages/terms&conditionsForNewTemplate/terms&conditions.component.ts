import { RegistrationEmail } from './../../../../shared/models/registration-email.model';
import { EmailService } from './../../../../shared/services/eml/email.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { CMSService } from 'src/app/shared/services/cms.service';
import { AuthenticationService } from '../../services/authentication.service';
import { UserForRegistration } from '../../models/user-for-registration.model';
import { User } from '@app/core/auth/models/user.model';
import { DomSanitizer } from '@angular/platform-browser'

declare var init: any;
@Component({
  selector: 'app-terms&conditions',
  templateUrl: './terms&conditions.component.html',
  styleUrls: ['./terms&conditions.component.css']
})
export class TermsNConditionsComponent implements OnInit {

  termsAndConditions:any;
  bannerUrl = ""

  constructor(
    private cmsService: CMSService,
    private _sanitizer: DomSanitizer
  ) {

    cmsService.getTermsConditions()
      .then((content: any) => {
        let languageFound: boolean = false;
        for (let key in content) {
          if(key === sessionStorage.getItem("selectedLanguage"))
          {
            this.termsAndConditions = this._sanitizer.bypassSecurityTrustHtml(content[key]);
            languageFound = true;
            if (content[key]==="") {
              this.termsAndConditions = this._sanitizer.bypassSecurityTrustHtml(content["en"]);
            }
          }
        }
        if(!languageFound) {
          this.termsAndConditions = this._sanitizer.bypassSecurityTrustHtml(content["en"]);
        }
      })
  }

  ngOnInit() {
    let promises = [
      this.cmsService.getNewBanner().then((response: any) => {
        this.bannerUrl = response.image.path;
      })
    ]

    Promise.all(promises).then(() => {
      setTimeout(() => init(), 0);
    });

  }


}
