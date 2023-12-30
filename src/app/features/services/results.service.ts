import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject, map } from 'rxjs';
import { RecentResultI } from 'src/app/api/model/recent-result.i';
import { baseUrl } from 'src/app/shared/variables';

@Injectable({
  providedIn: 'root',
})
export class ResultsService {
  constructor(private http: HttpClient) {}

  readonly recentResults$ = new ReplaySubject<RecentResultI[]>(1);

  readonly last3Avg$ = this.recentResults$.pipe(
    map((results) => {
      const last3Results = results.slice(0, 3);
      const avgWpm =
        last3Results.reduce((sum, result) => sum + result.wpm, 0) / last3Results.length;
      return Math.floor(avgWpm);
    })
  );

  updateRecentResults() {
    const url = `${baseUrl}/results/recent-results`;
    this.http
      .get<RecentResultI[]>(url)
      .subscribe((results) => this.recentResults$.next(results));
  }
}
