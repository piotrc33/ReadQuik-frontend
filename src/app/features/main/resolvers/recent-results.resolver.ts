import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { RecentResultI } from 'src/app/api/model/progress/recent-result.i';
import { ResultsApiService } from 'src/app/api/services/results-api.service';
import { RecentResultsState } from '../../exercises/services/recent-results/recent-results.state';
import { tap } from 'rxjs';

export const recentResultsResolver: ResolveFn<RecentResultI[]> = () => {
  const resultsApi = inject(ResultsApiService);
  const recentResultsState = inject(RecentResultsState);

  return resultsApi
    .getRecentResults()
    .pipe(
      tap((recentResults) =>
        recentResultsState.updateRecentResults(recentResults)
      )
    );
};
