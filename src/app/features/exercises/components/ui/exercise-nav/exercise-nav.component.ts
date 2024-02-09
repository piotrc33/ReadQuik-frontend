import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'exercise-nav',
  templateUrl: './exercise-nav.component.html',
  styleUrls: ['./exercise-nav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExerciseNavComponent {
  @Input()
  totalUnlocked: number = 1;
}
