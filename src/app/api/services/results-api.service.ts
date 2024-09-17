import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { RecentResult } from '../model/progress/recent-result.i';
import { ResultI } from '../model/progress/result.i';
import { EnvService } from './env.service';

@Injectable({
  providedIn: 'root',
})
export class ResultsApiService {
  readonly #http = inject(HttpClient);
  readonly #env = inject(EnvService);

  getRecentResults(): Observable<RecentResult[]> {
    return this.#http.get<RecentResult[]>(
      `${this.#env.getBaseUrl()}/results/recent-results`
    );
  }

  getAllResults(): Observable<ResultI[]> {
    return this.#http.get<ResultI[]>(
      `${this.#env.getBaseUrl()}/results/all-results`
    );
  }
}
