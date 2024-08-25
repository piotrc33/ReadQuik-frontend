import { Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, filter, map } from 'rxjs';
import { SaveData } from 'src/app/api/model/save-data.model';
import { ExercisesProgressStateService } from 'src/app/shared/services/exercises-progress-state.service';
import { ReadingDataService } from 'src/app/shared/services/reading-data/reading-data.service';
import { ResultsService } from 'src/app/shared/services/results.service';
import { calculateSpeed } from 'src/app/utils/utils';
import { BookService } from '../../library/services/book.service';
import { CurrentExerciseService } from './../../../shared/services/current-exercise.service';
import { ExerciseFlowService } from './exercise-flow.service';

@Injectable()
export class ExercisesStateService {
  readonly #flowService = inject(ExerciseFlowService);
  readonly #progressService = inject(ExercisesProgressStateService);
  readonly #bookService = inject(BookService);
  readonly #currentExerciseService = inject(CurrentExerciseService);
  readonly #resultsService = inject(ResultsService);
  readonly #readingDataService = inject(ReadingDataService);

  panelContentElement?: HTMLElement;
  activeElement?: HTMLElement;

  constructor() {
    this.#dataForSave$.pipe(takeUntilDestroyed()).subscribe((saveData) => {
      this.#resultsService.getRecentResultsAction.next();
      this.#readingDataService.getNextReadingDataAction.next(saveData);
    });
  }

  private readonly userWpm$ = this.#flowService.completedManualMode$.pipe(
    map(() => {
      const wpm = calculateSpeed(
        Date.now() - this.#flowService.startTime,
        this.#bookService.wordPhrases().join('').length
      );
      return wpm;
    })
  );

  readonly shouldSave$ = this.userWpm$.pipe(
    filter(
      (wpm) => wpm < 1000 && this.#progressService.isCurrentExerciseUnlocked()
    )
  );

  readonly #dataForSave$: Observable<SaveData> = this.shouldSave$.pipe(
    map((wpm) => {
      return {
        wpm: wpm,
        bookId: this.#bookService.currentBookId(),
        exerciseNumber: this.#currentExerciseService.exerciseNumber(),
        lastSegmentNumber: this.#bookService.currentSegment()?.number || 1,
      };
    })
  );
}
