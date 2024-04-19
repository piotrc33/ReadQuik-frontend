import { HttpClient } from '@angular/common/http';
import { Injectable, Signal, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReplaySubject, merge, switchMap } from 'rxjs';
import { RecentResultI } from 'src/app/api/model/progress/recent-result.i';
import { ExercisesStateService } from 'src/app/features/exercises/services/exercises-state.service';
import { baseUrl } from 'src/app/shared/variables';
import { ResultI } from '../../api/model/progress/result.i';

@Injectable()
export class ResultsService {
  private readonly http = inject(HttpClient);
  private readonly state = inject(ExercisesStateService);

  readonly loadRecentResultsAction$ = new ReplaySubject<void>(1);
  readonly recentResults: Signal<RecentResultI[]> = toSignal(
    merge(this.loadRecentResultsAction$, this.state.shouldSave$).pipe(
      switchMap(() =>
        this.http.get<RecentResultI[]>(`${baseUrl}/results/recent-results`)
      )
    ),
    { initialValue: [] }
  );

  readonly last3Avg = computed(() => {
    if(!this.recentResults()) {
      return 200;
    }
    const last3Results = this.recentResults().slice(0, 3);
    const avgWpm =
      last3Results.reduce((sum, result) => sum + result.wpm, 0) /
      last3Results.length;
    return Math.floor(avgWpm);
  });

  readonly allResults$ = this.http.get<ResultI[]>(
    `${baseUrl}/results/all-results`
  );
}
