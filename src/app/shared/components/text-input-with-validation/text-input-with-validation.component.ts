import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'text-input-with-validation',
  templateUrl: './text-input-with-validation.component.html',
  styleUrls: ['./text-input-with-validation.component.scss'],
})
export class TextInputWithValidationComponent {
  @Input()
  control: FormControl = new FormControl();

  @Input()
  size: 'small' | 'medium' | 'large' = 'large';

  @Input()
  label?: string;

  @Input()
  inputType?: string = 'text';
}
