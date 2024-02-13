import { Component, Input } from '@angular/core';

@Component({
  selector: 'repetition-indicator',
  templateUrl: './repetition-indicator.component.html',
  styleUrls: ['./repetition-indicator.component.scss'],
})
export class RepetitionIndicatorComponent {
  @Input({ required: true })
  totalCount?: number;

  @Input({ required: true })
  activeCount?: number;
}
