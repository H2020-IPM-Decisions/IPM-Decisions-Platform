import { EmailService } from './../../../../shared/services/eml/email.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {

  resetForm: FormGroup;
  submitted = false;
  constructor(private formBuilder: FormBuilder, private _emailService: EmailService) {}

  ngOnInit() {
    this.resetForm = this.formBuilder.group(
      {
        email: ['', [Validators.required, Validators.email]],
      },
    );    
  }

  get f() {
    console.log(this.resetForm.controls);
    console.log(this.resetForm.controls.email.value);
    
    return this.resetForm.controls;
  }

  onSubmit() {

    console.log("ok");
    
    this.submitted = true;

    if (this.resetForm.invalid) {
      return;
    }

    this._emailService.forgotPasswort(this.resetForm.value.email).subscribe(res => {
      console.log("res", res);
      
    })

  }

}