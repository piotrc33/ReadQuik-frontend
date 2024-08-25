import { Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, Subject, filter, map } from 'rxjs';
import { SaveData } from 'src/app/api/model/save-data.model';
import { CurrentExerciseService } from 'src/app/shared/services/current-exercise.service';
import { ExercisesProgressStateService } from 'src/app/shared/services/exercises-progress-state.service';
import { ReadingDataService } from 'src/app/shared/services/reading-data/reading-data.service';
import { ResultsService } from 'src/app/shared/services/results.service';
import { calculateSpeed } from 'src/app/utils/utils';
import { BookService } from '../../library/services/book.service';
import { ReadingDataStateService } from 'src/app/shared/services/reading-data/reading-data-state.service';

@Injectable({
  providedIn: 'root',
})
export class SaveService {
  readonly #progressService = inject(ExercisesProgressStateService);
  readonly #bookService = inject(BookService);
  readonly #currentExerciseService = inject(CurrentExerciseService);
  readonly #resultsService = inject(ResultsService);
  readonly #readingDataService = inject(ReadingDataService);
  readonly #readingDataState = inject(ReadingDataStateService);

  constructor() {
    this.#dataForSave$.pipe(takeUntilDestroyed()).subscribe((saveData) => {
      this.#readingDataService.getNextReadingDataAction.next(saveData);
      this.#resultsService.getRecentResultsAction.next();
    });
  }

  readonly getUserWpmAction = new Subject<number>();
  readonly #userWpm$ = this.getUserWpmAction.pipe(
    map((startTime: number) => {
      const wpm = calculateSpeed(
        Date.now() - startTime,
        this.#bookService.wordPhrases().join('').length
      );
      return wpm;
    })
  );

  readonly #shouldSave$ = this.#userWpm$.pipe(
    filter(
      (wpm) => wpm < 1000 && this.#progressService.isCurrentExerciseUnlocked()
    )
  );

  readonly #dataForSave$: Observable<SaveData> = this.#shouldSave$.pipe(
    map((wpm) => {
      return {
        wpm: wpm,
        bookId: this.#readingDataState.currentBookId(),
        exerciseNumber: this.#currentExerciseService.exerciseNumber(),
        lastSegmentNumber: this.#readingDataState.segmentNumber(),
      };
    })
  );
}
