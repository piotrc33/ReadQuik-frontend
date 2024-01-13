import { AbstractControl, ValidationErrors } from '@angular/forms';

export class CustomValidators {
  static email(control: AbstractControl): ValidationErrors | null {
    const value: string = control.value;

    if (!value) {
      return null;
    }

    const isValidEmail = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(
      value
    );

    return isValidEmail ? null : { email: true };
  }

  static usernameCharacters(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    if (!value) {
      return null;
    }

    const isValidUsername = /^[a-zA-Z0-9]*$/.test(value);

    return isValidUsername ? null : { forbiddenCharacters: true };
  }

  static passwordCharacters(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    if (!value) {
      return null;
    }

    const isValidPassword = /^[a-zA-Z0-9!@#$&*]+$/.test(value);

    return isValidPassword ? null : { forbiddenCharacters: true };
  }
}
