import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'input-with-label',
  templateUrl: './input-with-label.component.html',
  styleUrls: ['./input-with-label.component.scss']
})
export class InputWithLabelComponent implements OnInit {
  @Input() inputLabel?: string;
  @Input() inputId?: string;
  @Input() inputType?: string;
  @Input() inputName?: string;
  @Input() formControlName!: string;

  constructor() { }

  ngOnInit(): void {
  }

}
