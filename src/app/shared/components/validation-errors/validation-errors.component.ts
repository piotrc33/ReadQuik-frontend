import { Component, Input } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

@Component({
  selector: 'validation-errors',
  templateUrl: './validation-errors.component.html',
  styleUrls: ['./validation-errors.component.scss'],
})
export class ValidationErrorsComponent{
  @Input()
  errors: ValidationErrors | null = null;
}
