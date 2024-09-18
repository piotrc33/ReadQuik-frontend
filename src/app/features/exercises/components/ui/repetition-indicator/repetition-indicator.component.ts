import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'repetition-indicator',
  templateUrl: './repetition-indicator.component.html',
  styleUrls: ['./repetition-indicator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RepetitionIndicatorComponent {
  totalCount = input.required<number>();
  activeCount = input.required<number>();
}
