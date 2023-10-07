import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {
  trueBool: boolean = true;

  signupForm = this.fb.group({
    email: [
      '',
      [
        Validators.required,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        Validators.email
      ],
    ],
    username: [
      '',
      [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20),
        Validators.pattern(/^[a-zA-Z0-9]*$/),
      ],
    ],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^[a-zA-Z0-9!@#$&*]+$/),
      ],
    ],
  });
  constructor(
    private fb: FormBuilder,
    private readonly authService: AuthService
  ) {}

  isInputInvalid(name: string): boolean | undefined{
    return (
      this.signupForm.get(name)?.invalid &&
      (this.signupForm.get(name)?.touched)
    );
  }

  showError(name: string, errorType: string): boolean | undefined {
    return this.signupForm.get(name)?.hasError(errorType) && this.isInputInvalid(name);
  }

  onSubmit() {
    console.log(
      'submitted',
      this.signupForm.value,
      'valid?',
      this.signupForm.valid
    );
    this.authService.signup(this.signupForm.value).subscribe({
      next: (res) => {
        console.log('Registration successful', res);
      },
      error: (err) => {
        console.error('Registration failed', err);
      },
    });
  }
}
