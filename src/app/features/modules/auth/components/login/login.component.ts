import { Component } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

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
    private fb: UntypedFormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  onSubmit() {
    this.authService.login(this.loginForm.value).subscribe({
      next: (res: any) => {
        console.log('Login successful', res);
        if(res.loginSuccessful) {
          this.authService.saveToken(res.jwtToken);
          this.router.navigate(['']);
        }
      },
      error: (error: any) => {
        console.error('Login failed', error);
      },
    });
  }
}
