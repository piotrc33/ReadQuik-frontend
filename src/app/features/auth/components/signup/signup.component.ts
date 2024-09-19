import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomValidators } from 'src/app/shared/misc/custom-validators';
import { SignupFormI } from '../../model/signup-form.i';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupComponent {
  readonly #fb = inject(UntypedFormBuilder);
  readonly #authService = inject(AuthService);
  readonly #router = inject(Router);
  readonly signupForm: FormGroup<SignupFormI> = this.#fb.nonNullable.group({
    email: ['', [Validators.required, CustomValidators.email]],
    username: [
      '',
      [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20),
        CustomValidators.usernameCharacters,
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

  onSubmit() {
    this.#authService.signup(this.signupForm.getRawValue()).subscribe({
      next: () => {
        this.#router.navigate(['/', 'auth', 'login']);
      },
      error: err => {
        console.error('Registration failed', err);
      },
    });
  }
}
