import { Component, inject } from '@angular/core';
import { ExerciseFlowService } from '../../../services/exercise-flow.service';
import { PercentBarService } from '../../../services/percent-bar.service';
import { CurrentExerciseService } from './../../../../../shared/services/current-exercise.service';

@Component({
  selector: 'exercise-panel',
  templateUrl: './exercise-panel.component.html',
  styleUrls: ['./exercise-panel.component.scss'],
})
export class ExercisePanelComponent {
  readonly #flowService = inject(ExerciseFlowService);
  readonly #percentService = inject(PercentBarService);
  readonly #currentExerciseService = inject(CurrentExerciseService);

  closePanel() {
    this.#flowService.exitAction$.next();
  }

  get exerciseNumber(): number {
    return this.#currentExerciseService.exerciseNumber();
  }

  get progressBarPercentWidth(): number {
    return this.#percentService.paged()
      ? this.#percentService.pagedPercent()
      : this.#percentService.progressPercent();
  }

  get exerciseMode() {
    return this.#flowService.exerciseMode();
  }

  nextAction() {
    this.#flowService.nextAction$.next();
  }
}
