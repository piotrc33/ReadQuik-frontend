import { Injectable, WritableSignal, computed, signal } from '@angular/core';
import { RecentResultI } from 'src/app/api/model/progress/recent-result.i';

@Injectable({
  providedIn: 'root',
})
export class RecentResultsState {
  readonly #recentResults: WritableSignal<RecentResultI[]> = signal([]);

  updateRecentResults(newRecentResults: RecentResultI[]) {
    this.#recentResults.set(newRecentResults);
  }

  get recentResults() {
    return this.#recentResults.asReadonly();
  }

  readonly last3Avg = computed(() => {
    if (!this.recentResults()) {
      return 200;
    }
    const last3Results = this.recentResults().slice(0, 3);
    const avgWpm =
      last3Results.reduce((sum, result) => sum + result.wpm, 0) /
      last3Results.length;
    return Math.floor(avgWpm);
  });
}
