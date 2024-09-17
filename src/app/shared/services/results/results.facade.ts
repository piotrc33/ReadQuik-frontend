import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { ResultsApiService } from 'src/app/api/services/results-api.service';
import { RecentResultsState } from 'src/app/features/exercises/services/recent-results/recent-results.state';

@Injectable({
  providedIn: 'root',
})
export class ResultsFacade {
  readonly #recentResultsState = inject(RecentResultsState);
  readonly #resultsApi = inject(ResultsApiService);

  async getRecentResults() {
    const recentResults = await firstValueFrom(
      this.#resultsApi.getRecentResults()
    );
    this.#recentResultsState.updateRecentResults(recentResults);
  }

  readonly allResults$ = this.#resultsApi.getAllResults();
}
