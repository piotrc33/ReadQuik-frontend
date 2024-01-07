import { Component, Input } from '@angular/core';

@Component({
  selector: 'instruction',
  templateUrl: './instruction.component.html',
  styleUrls: ['./instruction.component.scss']
})
export class InstructionComponent {
  instructionKeys?: string[];

  @Input()
  instructionNumber?: number;

  @Input()
  set instructionObject(value: any) {
    this.instructionKeys = Object.keys(value);
  };

}
