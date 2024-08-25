import { Injectable, inject } from '@angular/core';
import {
  takeUntilDestroyed
} from '@angular/core/rxjs-interop';
import { Subject, switchMap } from 'rxjs';

import { ResultsApiService } from 'src/app/api/services/results-api.service';
import { RecentResultsState } from 'src/app/features/exercises/services/recent-results/recent-results.state';

@Injectable()
export class ResultsService {
  readonly #recentResultsState = inject(RecentResultsState);
  readonly #resultsApi = inject(ResultsApiService);

  constructor() {
    this.#recentResults$.pipe(takeUntilDestroyed()).subscribe((results) => {
      this.#recentResultsState.updateRecentResults(results);
    });
  }

  readonly getRecentResultsAction = new Subject<void>();
  readonly #recentResults$ = this.getRecentResultsAction.pipe(
    switchMap(() => this.#resultsApi.getRecentResults())
  );

  readonly allResults$ = this.#resultsApi.getAllResults();
}
