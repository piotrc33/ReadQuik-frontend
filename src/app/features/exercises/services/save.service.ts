import { Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, Subject, filter, map } from 'rxjs';
import { SaveData } from 'src/app/api/model/save-data.model';
import { CurrentExerciseService } from 'src/app/shared/services/current-exercise.service';
import { ExercisesProgressStateService } from 'src/app/shared/services/exercises-progress-state.service';
import { ReadingDataFacade } from 'src/app/shared/services/reading-data/reading-data.facade';
import { ResultsService } from 'src/app/shared/services/results.service';
import { calculateSpeed } from 'src/app/utils/utils';
import { PhrasesStateService } from './phrases-state.service';

@Injectable({
  providedIn: 'root',
})
export class SaveService {
  readonly #progressService = inject(ExercisesProgressStateService);
  readonly #currentExerciseService = inject(CurrentExerciseService);
  readonly #resultsService = inject(ResultsService);
  readonly #readingDataFacade = inject(ReadingDataFacade);
  readonly #phrasesService = inject(PhrasesStateService);

  constructor() {
    this.#dataForSave$.pipe(takeUntilDestroyed()).subscribe(saveData => {
      this.#readingDataFacade.getNextReadingData(saveData);
      this.#resultsService.getRecentResultsAction.next();
    });
  }

  readonly getUserWpmAction = new Subject<number>();
  readonly #userWpm$ = this.getUserWpmAction.pipe(
    map((startTime: number) => {
      const wpm = calculateSpeed(
        Date.now() - startTime,
        this.#phrasesService.wordPhrases().join('').length
      );
      return wpm;
    })
  );

  readonly #shouldSave$ = this.#userWpm$.pipe(
    filter(
      wpm => wpm < 1000 && this.#progressService.isCurrentExerciseUnlocked()
    )
  );

  readonly #dataForSave$: Observable<SaveData> = this.#shouldSave$.pipe(
    map(wpm => {
      return {
        wpm: wpm,
        bookId: this.#readingDataFacade.currentBookId(),
        exerciseNumber: this.#currentExerciseService.exerciseNumber(),
        lastSegmentNumber: this.#readingDataFacade.segmentNumber(),
      };
    })
  );
}
