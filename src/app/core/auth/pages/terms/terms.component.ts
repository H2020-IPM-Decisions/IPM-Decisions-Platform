import { RegistrationEmail } from './../../../../shared/models/registration-email.model';
import { EmailService } from './../../../../shared/services/eml/email.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { CMSService } from 'src/app/shared/services/cms.service';
import { AuthenticationService } from '../../services/authentication.service';
import { UserForRegistration } from '../../models/user-for-registration.model';
import { User } from '@app/core/auth/models/user.model';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.css']
})
export class TermsComponent implements OnInit {
  termsForm: FormGroup;
  submitted = false;
  termsAndConditions = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Orci ac auctor augue mauris. Nibh praesent tristique magna sit amet purus gravida. Elementum integer enim neque volutpat ac tincidunt vitae semper. Donec enim diam vulputate ut pharetra sit. Nulla facilisi cras fermentum odio eu. Enim diam vulputate ut pharetra sit amet aliquam id diam. Dignissim diam quis enim lobortis scelerisque fermentum. Ut diam quam nulla porttitor massa id neque aliquam. Pretium nibh ipsum consequat nisl vel pretium lectus quam. Arcu cursus euismod quis viverra nibh cras pulvinar mattis. Pulvinar mattis nunc sed blandit libero volutpat. Gravida arcu ac tortor dignissim. Libero volutpat sed cras ornare arcu. Mi eget mauris pharetra et ultrices neque. Mattis vulputate enim nulla aliquet. Malesuada pellentesque elit eget gravida cum sociis natoque penatibus et. Vulputate odio ut enim blandit volutpat maecenas volutpat blandit. Pretium quam vulputate dignissim suspendisse in est. Ut porttitor leo a diam. Aliquam faucibus purus in massa tempor nec feugiat nisl pretium. Feugiat nibh sed pulvinar proin. At urna condimentum mattis pellentesque id nibh. Leo vel fringilla est ullamcorper eget nulla facilisi. Montes nascetur ridiculus mus mauris vitae. Arcu bibendum at varius vel pharetra. Dignissim enim sit amet venenatis urna. Vel quam elementum pulvinar etiam. Mauris augue neque gravida in fermentum. Quisque id diam vel quam elementum pulvinar etiam non quam. Orci porta non pulvinar neque laoreet. At volutpat diam ut venenatis tellus in metus vulputate eu. Massa sapien faucibus et molestie ac feugiat sed lectus vestibulum. Nisl rhoncus mattis rhoncus urna neque viverra justo nec. Duis at tellus at urna condimentum mattis. Sed pulvinar proin gravida hendrerit lectus. Sit amet nulla facilisi morbi tempus iaculis urna id volutpat. Augue eget arcu dictum varius. Diam phasellus vestibulum lorem sed risus ultricies tristique nulla aliquet. Etiam non quam lacus suspendisse faucibus interdum. Tellus in hac habitasse platea. Pretium nibh ipsum consequat nisl vel pretium lectus quam. Egestas diam in arcu cursus euismod. Tempor nec feugiat nisl pretium. Aliquet nibh praesent tristique magna sit. Facilisis sed odio morbi quis commodo odio aenean sed adipiscing. Proin fermentum leo vel orci. Placerat duis ultricies lacus sed turpis tincidunt.';
  isLoading: boolean = false;
  @Input() registrationData: UserForRegistration;
  @Output() termsAccepted = new EventEmitter<boolean>();
  @Output() message = new EventEmitter<boolean>();

  constructor(
    private formBuilder: FormBuilder,
    private cmsService: CMSService,
    private _authService: AuthenticationService
  ) {
    cmsService.getTermsAndConditions()
      .then((terms: any) => { this.termsAndConditions = terms.content });
  }

  ngOnInit() {
    document.getElementById('login-box').classList.add("with-terms");
    document.getElementById('login-register-nav').hidden = true;
    this.termsForm = this.formBuilder.group(
      {
        acceptTerms: [false, Validators.requiredTrue]
      }
    );
  }
  get f() {
    return this.termsForm.controls;
  }
  onRegister(): void {
    this.submitted = true;
    if (this.termsForm.invalid) {
      return;
    }

    this.isLoading = true;

    this._authService.register(this.registrationData).subscribe(
      (registeredUser: User) => {
        if (registeredUser.id) {
          this.isLoading = false;
          this.message.emit(true);
          this.termsAccepted.emit(false);
        }
        document.getElementById('login-box').classList.remove("with-terms");
        document.getElementById('login-register-nav').hidden = false;
      },
      errorRes => {
        this.isLoading = false;
        this.termsAccepted.emit(false);
        document.getElementById('login-box').classList.remove("with-terms");
        document.getElementById('login-register-nav').hidden = false;
      }
    );

  }


}
