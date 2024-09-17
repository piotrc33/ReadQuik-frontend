import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { RecentResult } from 'src/app/api/model/progress/recent-result.i';
import { ResultsApiService } from 'src/app/api/services/results-api.service';
import { RecentResultsState } from '../../exercises/services/recent-results/recent-results.state';
import { tap } from 'rxjs';

export const recentResultsResolver: ResolveFn<RecentResult[]> = () => {
  const resultsApi = inject(ResultsApiService);
  const recentResultsState = inject(RecentResultsState);
  const state = recentResultsState.recentResults();

  return state.length > 0 ? state : resultsApi
    .getRecentResults()
    .pipe(
      tap((recentResults) =>
        recentResultsState.updateRecentResults(recentResults)
      )
    );
};
