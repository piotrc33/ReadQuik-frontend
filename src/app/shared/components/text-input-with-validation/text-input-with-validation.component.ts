import { Component, input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'text-input-with-validation',
  templateUrl: './text-input-with-validation.component.html',
  styleUrls: ['./text-input-with-validation.component.scss'],
})
export class TextInputWithValidationComponent {
  control = input<FormControl>(new FormControl());

  size = input<'small' | 'medium' | 'large'>('large');

  label = input<string>();

  inputType = input<string>('text');
}
