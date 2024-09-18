import { Component, OnInit, computed, inject, input } from '@angular/core';
import { filter, interval, takeUntil, tap } from 'rxjs';

import { ReadingDataFacade } from 'src/app/shared/services/reading-data/reading-data.facade';
import { getAverageTimeoutMs } from 'src/app/utils/utils';
import { RecentResultsState } from '../services/recent-results/recent-results.state';
import { Exercise } from './exercise';
import { ExerciseModeT } from './exercise-mode.type';

@Component({
  template: '',
})
export class AutoExerciseBase extends Exercise implements OnInit {
  readonly #recentResultsState = inject(RecentResultsState);
  readonly #readingDataFacade = inject(ReadingDataFacade);

  mode = input<ExerciseModeT>('manual');

  autoSpeed = computed(() => this.#recentResultsState.last3Avg() * 1.2);

  nextPhraseInterval$ = interval(
    getAverageTimeoutMs(
      this.#readingDataFacade.segmentText().length,
      this.wordPhrases().length,
      this.autoSpeed()
    )
  ).pipe(
    filter(() => this.flowService.exerciseMode() === 'auto'),
    takeUntil(this.flowService.completedAutoMode$),
    tap(() => {
      this.flowService.autoNextAction$.next();
      this.flowService.startTime = Date.now();
    })
  );

  ngOnInit(): void {
    this.subs.add = this.nextPhraseInterval$.subscribe();
    this.flowService.exerciseMode.set(this.mode());
  }
}
