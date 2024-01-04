import { Component, OnInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { SignupFormI } from '../../model/signup-form.i';
import { UserI } from 'src/app/api/model/user.i';
import { CustomValidators } from 'src/app/shared/misc/custom-validators';

@Component({
  selector: 'signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {
  signupForm: FormGroup<SignupFormI> = this.fb.nonNullable.group({
    email: [
      '',
      [
        Validators.required,
        CustomValidators.email,
      ],
    ],
    username: [
      '',
      [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20),
        CustomValidators.usernameCharacters
      ],
    ],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        CustomValidators.passwordCharacters,
      ],
    ],
  });
  constructor(
    private fb: UntypedFormBuilder,
    private readonly authService: AuthService
  ) {}

  onSubmit() {
    console.log(
      'submitted',
      this.signupForm.value,
      'valid?',
      this.signupForm.valid
    );
    this.authService.signup(this.signupForm.value as UserI).subscribe({
      next: (res) => {
        console.log('Registration successful', res);
      },
      error: (err) => {
        console.error('Registration failed', err);
      },
    });
  }
}
