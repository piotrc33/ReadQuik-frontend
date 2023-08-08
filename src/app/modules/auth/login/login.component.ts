import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm = this.fb.group({
    email: '',
    password: '',
  });
  constructor(
    private fb: FormBuilder,
    private readonly authService: AuthService
  ) {}

  onSubmit() {
    // console.log('submitted', this.loginForm.value);
    // this.authService.signupUser(this.loginForm.value).subscribe({
    //   next: (response) => {
    //     console.log('Registration successful');
    //   },
    //   error: (error) => {
    //     console.log('Registration failed');
    //   },
    // });
    // LOGIN
  }
}
