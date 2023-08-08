import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {
  signupForm = this.fb.group({
    email: '',
    username: '',
    password: '',
  });
  constructor(
    private fb: FormBuilder,
    private readonly authService: AuthService
  ) {}

  onSubmit() {
    console.log('submitted', this.signupForm.value);
    this.authService.signupUser(this.signupForm.value).subscribe({
      next: (res) => {
        console.log('Registration successful', res);
      },
      error: (err) => {
        console.error('Registration failed', err.message);
      },
    });
  }
}
