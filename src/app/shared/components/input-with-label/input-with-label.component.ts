import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'input-with-label',
  templateUrl: './input-with-label.component.html',
  styleUrls: ['./input-with-label.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputWithLabelComponent),
      multi: true,
    },
  ],
})
export class InputWithLabelComponent implements ControlValueAccessor {
  @Input()
  size: 'small' | 'medium' | 'large' = 'large';

  @Input()
  label?: string;

  innerValue: any;
  onChange = (value: any) => {};
  onTouched = () => {};

  writeValue(obj: any): void {
    this.innerValue = obj;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  handleChange(event: any) {
    this.innerValue = event.target.value;
    this.onChange(this.innerValue);
    this.onTouched();
  }
}
