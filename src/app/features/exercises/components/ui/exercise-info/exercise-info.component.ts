import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output, inject, input } from '@angular/core';
import { BookService } from 'src/app/features/library/services/book.service';
import { InstructionsService } from '../../../services/instructions/instructions.service';
import { CurrentExerciseService } from 'src/app/shared/services/current-exercise.service';
import { PhrasesStateService } from '../../../services/phrases-state.service';

@Component({
  selector: 'exercise-info',
  templateUrl: './exercise-info.component.html',
  styleUrl: './exercise-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExerciseInfoComponent implements OnInit {
  readonly #phrasesService = inject(PhrasesStateService);
  readonly #instructionService = inject(InstructionsService);
  readonly #currentExerciseService = inject(CurrentExerciseService);

  repetitions = input<number>(0);
  isExerciseUnlocked = input<boolean>(false);

  @Output()
  startedExercise = new EventEmitter<void>();

  ngOnInit(): void {
    this.#currentExerciseService.initialExerciseNumberAction$.next();
  }

  get isTextLoaded(): boolean {
    return this.#phrasesService.wordPhrases().length > 0;
  }

  get exerciseNumber() {
    return this.#currentExerciseService.exerciseNumber();
  }

  get currentInstructionObject(): any {
    return this.#instructionService.currentInstructionObject();
  }

  get instructionsOpened(): boolean {
    return this.#instructionService.instructionsOpened();
  }

  openInstructions() {
    this.#instructionService.openInstructionsAction$.next(true);
  }

  closeInstructions() {
    this.#instructionService.openInstructionsAction$.next(false);
  }
}
