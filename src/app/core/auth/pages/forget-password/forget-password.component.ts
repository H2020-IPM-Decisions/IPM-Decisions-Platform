import { EmailService } from './../../../../shared/services/eml/email.service';
import { IForgetPassword } from '../../models/forget-password.model';
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';

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
  constructor(
    private formBuilder: FormBuilder, 
    private _emailService: EmailService,
    private modalService: BsModalService
  ) {}

  ngOnInit() {
    this.resetForm = this.formBuilder.group(
      {
        email: ['', [Validators.required, Validators.email]],
      },
    );    
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

    this._emailService.forgotPasswort(emailForForgetPassword).subscribe(response => {
      this.modalRef = this.modalService.show(this.resetPasswordModal);
    });

  }

}