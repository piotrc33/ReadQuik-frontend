import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject } from '@angular/core';
import { ReplaySubject, map, switchMap } from 'rxjs';
import { RecentResultI } from 'src/app/api/model/progress/recent-result.i';
import { baseUrl } from 'src/app/shared/variables';
import { ResultI } from '../../api/model/progress/result.i';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable()
export class ResultsService {
  private readonly http = inject(HttpClient);

  readonly loadRecentResultsAction$ = new ReplaySubject<void>(1);
  readonly recentResults = toSignal(
    this.loadRecentResultsAction$.pipe(
      switchMap(() =>
        this.http.get<RecentResultI[]>(`${baseUrl}/results/recent-results`)
      )
    ),
    { initialValue: [] }
  );

  readonly last3Avg = computed(() => {
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
