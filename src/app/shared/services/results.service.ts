import { Injectable, Signal, computed, inject } from '@angular/core';
import {
  takeUntilDestroyed,
  toObservable,
  toSignal,
} from '@angular/core/rxjs-interop';
import { ReplaySubject, merge, switchMap, tap } from 'rxjs';

import { RecentResultI } from 'src/app/api/model/progress/recent-result.i';
import { ResultsApiService } from 'src/app/api/services/results-api.service';
import { ExercisesStateService } from 'src/app/features/exercises/services/exercises-state.service';
import { RecentResultsState } from 'src/app/features/exercises/services/recent-results/recent-results.state';

@Injectable()
export class ResultsService {
  readonly #state = inject(ExercisesStateService);
  readonly #recentResultsState = inject(RecentResultsState);
  readonly #resultsApi = inject(ResultsApiService);

  constructor() {
    this.recentResults$.pipe(takeUntilDestroyed()).subscribe((results) => {
      this.#recentResultsState.updateRecentResults(results);
    });
  }

  readonly recentResults: Signal<RecentResultI[]> = toSignal(
    this.#state.shouldSave$.pipe(
      switchMap(() => this.#resultsApi.getRecentResults())
    ),
    { initialValue: this.#recentResultsState.recentResults() }
  );
  readonly recentResults$ = toObservable(this.recentResults);

  readonly allResults$ = this.#resultsApi.getAllResults();
}
