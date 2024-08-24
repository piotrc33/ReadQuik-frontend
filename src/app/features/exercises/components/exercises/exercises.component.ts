import { Component, OnInit, Signal, inject } from '@angular/core';

import { BookDataI } from 'src/app/api/model/library/book-data.i';
import { SegmentI } from 'src/app/api/model/segment.i';
import { BookService } from 'src/app/features/library/services/book.service';
import { CurrentExerciseService } from 'src/app/shared/services/current-exercise.service';
import { ExercisesProgressStateService } from 'src/app/shared/services/exercises-progress-state.service';
import { ReadingDataService } from 'src/app/shared/services/reading-data/reading-data.service';
import { ResultsService } from 'src/app/shared/services/results.service';
import { ExerciseFlowService } from '../../services/exercise-flow.service';
import { InstructionsService } from '../../services/instructions.service';
import { RecentResultI } from 'src/app/api/model/progress/recent-result.i';

@Component({
  selector: 'exercises',
  templateUrl: './exercises.component.html',
  styleUrls: ['./exercises.component.scss'],
})
export class ExercisesComponent implements OnInit {
  readonly #bookService = inject(BookService);
  readonly #readingData = inject(ReadingDataService);
  readonly #progressState = inject(ExercisesProgressStateService);
  readonly #currentExerciseService = inject(CurrentExerciseService);
  readonly #flowService = inject(ExerciseFlowService);
  readonly #resultsService = inject(ResultsService);
  readonly #instructionService = inject(InstructionsService);
  readonly exerciseNumber = this.#currentExerciseService.exerciseNumber;

  ngOnInit(): void {
    this.#resultsService.loadRecentResultsAction$.next();
    this.#currentExerciseService.initialExerciseNumberAction$.next();
  }

  changeSegment(segmentNumber: number) {
    this.#readingData.changeSegmentAction$.next(segmentNumber);
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

  get currentBookData(): BookDataI | undefined {
    return this.#bookService.currentBookData();
  }

  get segmentData(): SegmentI | undefined {
    return this.#bookService.segmentData();
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

  get recentResults(): Signal<RecentResultI[]> {
    return this.#resultsService.recentResults;
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
