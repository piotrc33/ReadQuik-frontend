import { ChangeDetectionStrategy, Component, EventEmitter, Output, input } from '@angular/core';

@Component({
  selector: 'exercise-info',
  templateUrl: './exercise-info.component.html',
  styleUrl: './exercise-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExerciseInfoComponent {
  exerciseNumber = input<number>(1);
  repetitions = input<number>(0);
  isExerciseUnlocked = input<boolean>(false);
  isTextLoaded = input<boolean>();

  @Output()
  instructionsOpened = new EventEmitter<void>();

  @Output()
  startedExercise = new EventEmitter<void>();
}
