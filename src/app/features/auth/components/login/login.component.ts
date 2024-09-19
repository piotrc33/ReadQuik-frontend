import {
  ChangeDetectionStrategy,
  Component,
  signal,
  inject,
} from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError } from 'rxjs';
import { LoginResponseI } from 'src/app/api/model/auth/login-response.i';
import { CustomValidators } from 'src/app/shared/misc/custom-validators';
import { LoginFormI } from '../../model/login-form.i';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  readonly #fb = inject(UntypedFormBuilder);
  readonly #authService = inject(AuthService);
  readonly #router = inject(Router);
  readonly loginForm: FormGroup<LoginFormI> = this.#fb.nonNullable.group({
    email: ['', [Validators.required, CustomValidators.email]],
    password: ['', Validators.required],
  });

  showLoginError = signal<boolean>(false);

  onSubmit() {
    this.#authService
      .login(this.loginForm.getRawValue())
      .pipe(
        catchError((error: any) => {
          console.error('Login failed', error);
          this.showLoginError.set(true);
          throw error;
        })
      )
      .subscribe((res: LoginResponseI) => {
        if (res.loginSuccessful) {
          this.#authService.saveToken(res.jwtToken);
          this.#router.navigate(['']);
          this.showLoginError.set(false);
        }
      });
  }
}
