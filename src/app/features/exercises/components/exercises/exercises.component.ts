import { Component, OnInit, inject } from '@angular/core';

import { BookService } from 'src/app/features/library/services/book.service';
import { CurrentExerciseService } from 'src/app/shared/services/current-exercise.service';
import { ExercisesProgressStateService } from 'src/app/shared/services/exercises-progress-state.service';
import { ExerciseFlowService } from '../../services/exercise-flow.service';
import { InstructionsService } from '../../services/instructions.service';

@Component({
  selector: 'exercises',
  templateUrl: './exercises.component.html',
  styleUrls: ['./exercises.component.scss'],
})
export class ExercisesComponent implements OnInit {
  readonly #bookService = inject(BookService);
  readonly #progressState = inject(ExercisesProgressStateService);
  readonly #currentExerciseService = inject(CurrentExerciseService);
  readonly #flowService = inject(ExerciseFlowService);
  readonly #instructionService = inject(InstructionsService);
  readonly exerciseNumber = this.#currentExerciseService.exerciseNumber;

  ngOnInit(): void {
    this.#currentExerciseService.initialExerciseNumberAction$.next();
  }

  get unlockedExercisesCount(): number {
    return this.#progressState.unlockedExercisesCount();
  }

  get currentExerciseRepetitions(): number | undefined {
    return this.#progressState.currentExerciseRepetitions();
  }

  get isCurrentExerciseUnlocked(): boolean {
    return this.#progressState.isCurrentExerciseUnlocked();
  }

  get wordPhrases(): string[] {
    return this.#bookService.wordPhrases();
  }

  get exerciseOpened(): boolean {
    return this.#flowService.exerciseOpened();
  }

  startExercise() {
    this.#flowService.startExerciseAction$.next();
  }

  get instructionsOpened(): boolean {
    return this.#instructionService.instructionsOpened();
  }

  get currentInstructionObject(): any {
    return this.#instructionService.currentInstructionObject();
  }

  openInstructions() {
    this.#instructionService.openInstructionsAction$.next(true);
  }

  closeInstructions() {
    this.#instructionService.openInstructionsAction$.next(false);
  }
}
