import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'instruction',
  templateUrl: './instruction.component.html',
  styleUrls: ['./instruction.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InstructionComponent {
  instructionKeys?: string[];

  @Input()
  instructionNumber?: number;

  @Input()
  set instructionObject(value: Record<string, string>) {
    this.instructionKeys = Object.keys(value);
  };

}
