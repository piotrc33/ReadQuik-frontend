import { Component, inject } from '@angular/core';

import { ExercisesProgressStateService } from 'src/app/shared/services/exercises-progress-state.service';
import { ExerciseFlowService } from '../../services/exercise-flow.service';

@Component({
  selector: 'exercises',
  templateUrl: './exercises.component.html',
  styleUrls: ['./exercises.component.scss'],
})
export class ExercisesComponent {
  readonly #progressState = inject(ExercisesProgressStateService);
  readonly #flowService = inject(ExerciseFlowService);

  get unlockedExercisesCount(): number {
    return this.#progressState.unlockedExercisesCount();
  }

  get currentExerciseRepetitions(): number | undefined {
    return this.#progressState.currentExerciseRepetitions();
  }

  get isCurrentExerciseUnlocked(): boolean {
    return this.#progressState.isCurrentExerciseUnlocked();
  }

  get exerciseOpened(): boolean {
    return this.#flowService.exerciseOpened();
  }

  startExercise() {
    this.#flowService.startExerciseAction$.next();
  }
}
