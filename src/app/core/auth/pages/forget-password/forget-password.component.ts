import { EmailService } from './../../../../shared/services/eml/email.service';
import { IForgetPassword } from '../../models/forget-password.model';
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CMSService } from '@app/shared/services/cms.service';
import { DomSanitizer } from '@angular/platform-browser';
declare var init: any;
@Component({
  selector: 'forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {

  @ViewChild('resetPasswordModal', { static: false }) public resetPasswordModal: TemplateRef<any>;
  modalRef: any;
  resetForm: FormGroup;
  submitted = false;
  confirmationMessage: any;
  constructor(
    private formBuilder: FormBuilder, 
    private _emailService: EmailService,
    private modalService: BsModalService,
    private _cmsService: CMSService,
    private _sanitizer: DomSanitizer,
  ) {}

  ngOnInit() {
    this.resetForm = this.formBuilder.group(
      {
        email: ['', [Validators.required, Validators.email]],
      },
    );
    let promises = [
      this._cmsService.getForgotPasswordConfirmationMessage()
        .then((fpMessage: any) => {
          let languageFound: boolean = false;
          for (let key in fpMessage) {
            if(key === sessionStorage.getItem("selectedLanguage"))
            {
              this.confirmationMessage = this._sanitizer.bypassSecurityTrustHtml(fpMessage[key]);
              languageFound = true;
              if (fpMessage[key]==="") {
                this.confirmationMessage = this._sanitizer.bypassSecurityTrustHtml(fpMessage["en"]);
              }
            }
          }
          if(!languageFound) {
            this.confirmationMessage = this._sanitizer.bypassSecurityTrustHtml(fpMessage["en"]);
          }
        }),
    ];
    Promise.all(promises).then(() => {
      setTimeout(() => init(), 0)
    })    
  }

  get f() {
    return this.resetForm.controls;
  }

  onSubmit() {
    
    this.submitted = true;

    if (this.resetForm.invalid) {
      return;
    }

    const emailForForgetPassword: IForgetPassword = {
      email: (<string>this.resetForm.value.email).toLowerCase()
    }

    this._emailService.forgotPassword(emailForForgetPassword).subscribe(response => {
      this.modalRef = this.modalService.show(this.resetPasswordModal);
    });

  }

}