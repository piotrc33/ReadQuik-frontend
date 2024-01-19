import { Component } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginDataI } from 'src/app/api/model/auth/login-data.i';
import { CustomValidators } from 'src/app/shared/misc/custom-validators';
import { LoginFormI } from '../../model/login-form.i';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm: FormGroup<LoginFormI> = this.fb.nonNullable.group({
    email: ['', [Validators.required, CustomValidators.email]],
    password: ['', Validators.required],
  });
  constructor(
    private fb: UntypedFormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  onSubmit() {
    this.authService.login(this.loginForm.value as LoginDataI).subscribe({
      next: (res: any) => {
        console.log('Login successful', res);
        if (res.loginSuccessful) {
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
