import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'instruction',
  templateUrl: './instruction.component.html',
  styleUrls: ['./instruction.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstructionComponent {
  instructionNumber = input<number>();
  instructionKeys = input<string[]>([]);
}
