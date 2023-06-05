import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { EmailService } from './../../../../shared/services/eml/email.service';
import { IResendConfirmation } from '../../models/resend-confirmation-email.model';

@Component({
    selector: 'resend-confirmation-email',
    templateUrl: './resend-confirmation-email.component.html',
    styleUrls: ['./resend-confirmation-email.component.css']
})

export class ResendConfirmationEmailComponent implements OnInit {

    @ViewChild('resendConfirmationEmailModal') public resendConfirmationEmailModal: TemplateRef<any>;
    modalRef: BsModalRef;
    resendForm: FormGroup;
    submitted = false;
    constructor(
        private formBuilder: FormBuilder, 
        private _emailService: EmailService,
        private modalService: BsModalService,
    ) {}

    ngOnInit() {
        this.resendForm = this.formBuilder.group(
            {
              email: ['', [Validators.required, Validators.email]],
            },
          );
    }

    get f() {
        return this.resendForm.controls;
    }

    onSubmit() {
        if (this.resendForm.invalid) {
          return;
        }
    
        const emailForResendConfirmation: IResendConfirmation = {
          email: (<string>this.f.email.value).toLowerCase()
        }
    
        this._emailService.resendConfirmationEmail(emailForResendConfirmation).subscribe(response => {
          this.modalRef = this.modalService.show(this.resendConfirmationEmailModal);
        });
      }
}