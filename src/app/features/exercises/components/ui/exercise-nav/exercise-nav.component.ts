import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'exercise-nav',
  templateUrl: './exercise-nav.component.html',
  styleUrls: ['./exercise-nav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExerciseNavComponent {
  totalUnlocked = input(1);
}
